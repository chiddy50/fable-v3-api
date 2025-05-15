#!/bin/bash
set -e

# Run database migrations
echo "Running db migrations..."
npx prisma migrate deploy
echo "Db migrations complete ola"

echo "Running prisma generate..."
npx prisma generate
echo "Prisma generate complete ola"

echo "Running db seed..."
npx prisma db seed
echo "Db seed complete"

# Build API artifacts
echo "Building API artifacts..."
npm run build

# Start the application
npm start
