#!/bin/bash

# Get the repository root directory (one level up from the script directory)
repo_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"

# Define the source and target directories
config_defaults_directory="$repo_directory/configs/defaults"
config_directory="$repo_directory/configs"

# Ensure the source directory exists
if [ ! -d "$config_defaults_directory" ]; then
  echo "Source directory $config_defaults_directory does not exist."
  exit 1
fi

# Copy default configuration files to the target directory
cp -r "$config_defaults_directory/"* "$config_directory/"

# Replace placeholders in JSON files within the target directory, excluding the source directory
find "$config_directory" -maxdepth 1 -name "*.json" -type f -exec sed -i "s|{{REPO_DIR}}|$repo_directory|g" {} +

echo "Default configuration files have been copied to the target directory with updated paths."
