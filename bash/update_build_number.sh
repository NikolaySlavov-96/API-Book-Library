#!/bin/bash

# Function to increment patch version
increment_patch_version() {
    local version=$1
    local delimiter=.

    # Split version into array
    local version_parts=(${version//./ })

    # Increment the patch version
    version_parts[2]=$((version_parts[2] + 1))

    # Join the array back into a string
    echo "${version_parts[0]}${delimiter}${version_parts[1]}${delimiter}${version_parts[2]}"
}

# Read the current version and build number from package.json
version=$(jq -r '.version' package.json)
build_number=$(jq -r '.buildNumber // 0' package.json)

# Increment the patch version and build number
new_version=$(increment_patch_version "$version")
new_build_number=$((build_number + 1))

# Update package.json with the new version and build number
jq --arg new_version "$new_version" --argjson new_build_number "$new_build_number" \
   '.version = $new_version | .buildNumber = $new_build_number' package.json > tmp.json && mv tmp.json package.json

echo "Updated package.json with version: $new_version and buildNumber: $new_build_number"