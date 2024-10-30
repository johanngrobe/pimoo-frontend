#!/bin/bash

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install

# Step 2: Build the Vue application
echo "Building the app..."
npm run build

# Step 3: Copy the build files to the deployment directory
TARGET_DIR="/var/www/pimoo-1rz.fab.hs-rm.de/html/"
echo "Copying files to $TARGET_DIR"
sudo cp -r dist/* "$TARGET_DIR"

echo "Deployment complete!"