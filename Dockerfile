# Use Node.js 16 as the base image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]