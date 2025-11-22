# --- STAGE 1: Build Stage (Install Dependencies, Compile TS) ---
FROM node:20-slim AS builder

WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files (including src folder and tsconfig.json)
COPY . .

# 🎯 CRITICAL FIX: Run the TypeScript compilation to create the 'dist' folder
# RUN npm run build 

# --- STAGE 2: Production Stage (Minimal Runtime) ---
FROM node:20-slim AS production

WORKDIR /app

# Copy only production dependencies (from the initial install)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 🎯 CRITICAL FIX: Copy the COMPILED output ('dist' folder) from the builder stage
COPY --from=builder /app/dist ./dist 

# Remove unnecessary COPY . . since we only need the compiled files
# DELETE: COPY . . 

# Set the port
ENV PORT=4000
EXPOSE 4000

# Command to run the compiled application (using the 'start' script)
CMD ["npm", "start"]