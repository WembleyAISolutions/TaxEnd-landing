#!/bin/bash

echo "Starting final deployment..."

# Add all changes
git add .

# Commit with message
git commit -m "Update dependencies and add deployment script"

# Push to GitHub
git push origin main

echo "Deployment complete!"
echo "Please check your Vercel dashboard for automatic deployment status."
