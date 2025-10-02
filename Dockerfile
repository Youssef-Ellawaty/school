# Use official MongoDB image as a base
FROM mongo:3.6 as mongodb

# Use Node.js base image
FROM node:16-slim

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Create data directories
RUN mkdir -p /data/db /data/files

# Copy MongoDB binaries from MongoDB image
COPY --from=mongodb /usr/bin/mongod /usr/bin/mongod
COPY --from=mongodb /usr/bin/mongo /usr/bin/mongo

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy app source
COPY . .

# Set environment variables
ENV PORT=3000
ENV MONGODB_URI=mongodb://localhost:27017/school_db
ENV PARSE_SERVER_APPLICATION_ID=WVPClNsBDJiG2ZdyIi9tOrKdgpPTpWbXs3jojIII
ENV PARSE_SERVER_MASTER_KEY=l4YNC3ErDQN2OWrwrI237bCQrY7DclJU3SLO7loa

# Expose ports
EXPOSE 3000
EXPOSE 27017

# Create startup script
RUN echo '#!/bin/bash\nmongod --fork --logpath /var/log/mongodb.log --dbpath /data/db\nnode server.js' > /usr/src/app/start.sh && \
    chmod +x /usr/src/app/start.sh

# Start command
CMD ["/usr/src/app/start.sh"]

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Create data directory
RUN mkdir -p data

# Start command
CMD [ "node", "server.js" ]