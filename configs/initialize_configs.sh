#!/bin/bash

# Get the directory of the script (which should be the configs directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define the source directory (defaults) and the destination directory (configs)
SOURCE_DIR="$SCRIPT_DIR/defaults"
DEST_DIR="$SCRIPT_DIR"

# Check if the source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Source directory $SOURCE_DIR does not exist."
  exit 1
fi

# Copy the contents of the defaults directory to the configs directory, overwriting existing files
cp -r "$SOURCE_DIR/"* "$DEST_DIR/"

echo "Default configuration files have been copied to the configs directory."
