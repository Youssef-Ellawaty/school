# Use Node.js base image
FROM node:16

# Install MongoDB
RUN wget -qO - https://www.mongodb.org/static/pgp/server-3.6.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list && \
    apt-get update && \
    apt-get install -y mongodb-org

# Create app directory
WORKDIR /usr/src/app

# Create MongoDB data directory
RUN mkdir -p /data/db

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