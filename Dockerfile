FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-workspace.yaml ./

# Copy package directories
COPY packages ./packages

# Install dependencies
RUN pnpm install

# Build api-server
RUN pnpm --filter @workspace/api-server build

# Expose port
EXPOSE 3000

# Start server
CMD ["pnpm", "--filter", "@workspace/api-server", "start"]
