#!/bin/bash
set -e

# Run database migrations
echo "Running db reset..."
npx prisma migrate reset --force  --skip-seed
echo "Db reset complete ola"

echo "running prisma generate"
npx prisma generate
echo "running prisma generate complete ola"

echo "running db push"
#npx prisma db push
echo "db push complete"

echo "running db seed"
npx prisma db seed
echo "db seed complete"

# Seed the database
echo "build API artifacts..."
npm run build

#Start the application
npm start
