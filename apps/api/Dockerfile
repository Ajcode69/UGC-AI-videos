FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
# Copy workspace config and API package files
COPY apps/api/package*.json ./apps/api/

# Install dependencies using npm workspaces
RUN npm install

# Copy API source code
COPY apps/api ./apps/api

# Set working directory to API
WORKDIR /app/apps/api

# Expose API port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
