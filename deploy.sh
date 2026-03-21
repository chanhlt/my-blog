#!/bin/bash
set -e

echo "Pulling latest changes..."
git pull origin main

echo "Building and restarting containers..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  --env-file .env.production \
  up -d --build

echo "Cleaning up old images..."
docker image prune -f

echo "Deploy complete!"
echo ""
docker compose ps
