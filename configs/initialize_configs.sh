#!/bin/bash

# This script initializes configuration files by copying them from the defaults directory
# and replacing a placeholder ({{REPO_DIR}}) with the absolute path of the repository's parent directory.
# This ensures that configuration files have the correct paths before being used.

# Get the absolute path of the parent directory
REPO_DIR=$(realpath ../)

# Ensure the defaults directory exists
if [ ! -d "./defaults" ]; then
    echo "Error: ./defaults directory does not exist."
    exit 1
fi

# Copy all JSON files from ./defaults to ./
cp ./defaults/*.json ./

# Replace {{REPO_DIR}} with the actual absolute path in each JSON file
for file in ./*.json; do
    sed -i "s#{{REPO_DIR}}#$REPO_DIR#g" "$file"
done

echo "Configuration files have been initialized."
