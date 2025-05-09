# Stage 1: Build MCP Server
FROM node:20-alpine AS mcp-builder
WORKDIR /app
# Copy root package files and relevant workspace package.json files
COPY package.json package-lock.json ./
COPY ./policy-edit/mcp/package.json ./policy-edit/mcp/
COPY ./policy-edit/backend/package.json ./policy-edit/backend/
# Install ALL dependencies (including dev) needed for build, based on root lock file
RUN npm install --workspace=github-contribution-mcp
RUN npm install --workspace=idobata-policy-editor-backend

WORKDIR /app/policy-edit/mcp
# Copy the mcp source code
COPY ./policy-edit/mcp ./
# Build mcp
RUN npm run build

# Stage 2: Build Backend Server
FROM node:20-alpine AS backend-builder
WORKDIR /app
# Copy installed node_modules from the first stage
COPY --from=mcp-builder /app/node_modules ./node_modules

WORKDIR /app/policy-edit/backend
# Copy the backend source code
COPY ./policy-edit/backend ./
# Build backend
RUN npm run build

# Stage 3: Final Production Image
FROM node:20-alpine AS production
WORKDIR /app

# Copy installed node_modules from the first stage
COPY --from=mcp-builder /app/node_modules ./node_modules

# Copy built artifacts from builders
COPY --from=mcp-builder /app/policy-edit/mcp/dist ./policy-edit/mcp/dist/
COPY --from=backend-builder /app/policy-edit/backend/build ./policy-edit/backend/build/

# Set environment variable for MCP server path within the container
ENV MCP_SERVER_PATH=/app/policy-edit/mcp/dist/main.js
# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy the private key into the final image
# IMPORTANT: Ensure the key exists at ./policy-edit/backend/secrets/github-key.pem during build
COPY ./policy-edit/backend/secrets/github-key.pem /app/secrets/github-key.pem

# Copy backend package.json (optional, if needed by CMD or runtime)
COPY ./policy-edit/backend/package.json ./policy-edit/backend/package.json

WORKDIR /app/policy-edit/backend
EXPOSE 3001
CMD ["node", "build/index.js"]


# Development stage removed as hot-reload is disabled