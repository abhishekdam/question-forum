# --- STAGE 1: Dependency & Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and run build
COPY . .

# Run the production build command (creates the 'dist' folder)
RUN npm run build

# --- STAGE 2: Production Server (Serve static files with Nginx) ---
# Since Vite outputs static assets, we use a dedicated web server (Nginx) for efficiency.
FROM nginx:alpine AS runner

# Copy the built files from the builder stage into Nginx's web root
# 🎯 FIX 1: Copy the 'dist' folder contents (Vite output)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file (optional, but good practice)
# If you have a custom nginx.conf, uncomment the line below:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx HTTP port
EXPOSE 80

# Nginx starts automatically
CMD ["nginx", "-g", "daemon off;"]