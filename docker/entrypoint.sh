#!/bin/bash
set -e

# Run database migrations
echo "Running prisma generate..."
#npx prisma migrate reset --force
npx prisma generate

# Seed the database
echo "build API artifacts..."
npm run build

# Start the application
echo "Starting the application..."
npm start
