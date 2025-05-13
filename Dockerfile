# Step 1: Build React app
FROM node:22 AS builder

WORKDIR /app

# Copy only package files first to install dependencies (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code (including public/index.html)
COPY . .

# Build the app
RUN npm run build

# Step 2: Run the app using 'serve'
FROM node:22-slim

# Install 'serve' globally
RUN npm install -g serve

WORKDIR /app

# Copy the built React app from the builder stage
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3082

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3082"]
