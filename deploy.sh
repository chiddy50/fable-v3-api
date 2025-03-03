#!/bin/bash

set -e

APP_DIR="/root/fable"
BACKEND_DIR="$APP_DIR/fable-v3-api/"
FRONTEND_DIR="$APP_DIR/fable-v3-frontend/"
BRANCH="devops"

echo "update API code base"

pwd

cd $BACKEND_DIR || exit

echo "Pulling the latest code from branch $BRANCH..."
git fetch --all
git reset --hard origin/$BRANCH

echo "refreshing deploymemnt..."
cd $APP_DIR || exit


echo "Rebuilding FRONTEND service..."
docker compose build node-api

echo "Restarting FRONTEND service..."
docker compose up -d node-api

echo "waiting for health status"
sleep 15

echo "Restarting NGINX"
systemctl restart nginx

echo "Checking Docker services status..."
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo "Deployment completed successfully."
