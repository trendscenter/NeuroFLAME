#!/bin/bash

# Function to convert Git Bash paths to Windows paths for any drive
convert_path_to_windows() {
  local path="$1"
  # Extract the drive letter and convert it to uppercase (e.g., /c/ -> C:/)
  echo "$path" | sed 's|^/\([a-zA-Z]\)/|\U\1:/|'
}

# Determine if the OS is Windows or Linux
os_type="$(uname -s)"

if [[ "$os_type" == *CYGWIN* || "$os_type" == *MINGW* || "$os_type" == *MSYS* ]]; then
  echo "Detected Windows environment."
  # Convert repo directory path to Windows format
  repo_directory=$(convert_path_to_windows "$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)")
else
  echo "Detected Linux/Unix environment."
  # Use Unix-style path
  repo_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
fi

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
