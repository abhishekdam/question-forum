#!/bin/bash

# Clean Build Script for Railway Deployment
# This ensures fresh builds by removing stale artifacts before building

set -e

echo "🧹 Cleaning build artifacts..."

# Clean frontend build artifacts
if [ -d "frontend/dist" ]; then
  echo "Removing frontend/dist..."
  rm -rf frontend/dist
fi

if [ -d "frontend/build" ]; then
  echo "Removing frontend/build..."
  rm -rf frontend/build
fi

# Clean backend build artifacts
if [ -d "backend/dist" ]; then
  echo "Removing backend/dist..."
  rm -rf backend/dist
fi

if [ -d "backend/build" ]; then
  echo "Removing backend/build..."
  rm -rf backend/build
fi

echo "✅ Build artifacts cleaned"

# Build backend
echo "🔨 Building backend..."
cd backend
npm install
npm run build
cd ..

echo "✅ Backend built successfully"

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Frontend built successfully"
echo "🎉 Full build completed!"
