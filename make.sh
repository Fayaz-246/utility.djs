#!/bin/bash

# Remove the old dist/defaults directory
rm -rf dist/defaults/

# Compile TypeScript
npm run build

# Copy defaults folder to dist
cp -r src/defaults/ dist/defaults

#Delete Old TGZ Files
rm *.tgz

# Create npm package
npm pack
