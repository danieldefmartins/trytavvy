# Build stage - cache bust v2
FROM node:22-alpine AS builder

WORKDIR /app

# Define build arguments for Vite environment variables
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_OAUTH_PORTAL_URL

# Set them as environment variables for the build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_OAUTH_PORTAL_URL=$VITE_OAUTH_PORTAL_URL

# Install pnpm globally
RUN npm install -g pnpm@10.4.1

# Cache bust - forces rebuild when this value changes
ARG CACHEBUST=1

# Copy package files first for better caching
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install all dependencies (including dev for build)
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install all dependencies (vite is needed at runtime for serving static files)
RUN pnpm install

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "dist/index.js"]
