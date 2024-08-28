# backend/Dockerfile

ARG NODE_VERSION=20.16.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV development  # Set to development for including devDependencies

WORKDIR /usr/src/app

# Install dependencies using npm ci
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 8000

# Start the backend application
CMD ["npm", "run", "dev"]
