# frontend/Dockerfile

ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Install dependencies using npm ci
COPY package*.json ./
RUN npm ci
RUN npm i

# Copy the rest of the application code
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the frontend application
CMD ["npm", "start"]
