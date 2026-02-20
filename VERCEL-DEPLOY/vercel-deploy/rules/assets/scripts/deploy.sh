#!/bin/bash
# deploy.sh - Production deployment script

set -e

echo "🚀 Starting deployment..."

# Verify environment
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN not set"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build
echo "🔨 Building..."
vercel build --prod --token=$VERCEL_TOKEN

# Deploy
echo "🚀 Deploying..."
vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN

echo "✅ Deployment complete!"
