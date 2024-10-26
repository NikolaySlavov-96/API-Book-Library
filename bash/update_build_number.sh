#!/bin/bash

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

increment_minor_version() {
    local version=$1
    local delimiter=.

    # Split version into array
    local version_parts=(${version//./ })

    # Increment the minor version and reset patch version
    version_parts[1]=$((version_parts[1] + 1))
    version_parts[2]=0

    # Join the array back into a string
    echo "${version_parts[0]}${delimiter}${version_parts[1]}${delimiter}${version_parts[2]}"
}

version=$(jq -r '.version' package.json)
build_number=$(jq -r '.buildNumber // 0' package.json)

if [[ "$GITHUB_EVENT_NAME" == "pull_request" && "$(jq -r '.action' "$GITHUB_EVENT_PATH")" == "closed" && "$(jq -r '.pull_request.merged' "$GITHUB_EVENT_PATH")" == "true" ]]; then
    # Increment minor version for merged pull requests
    new_version=$(increment_minor_version "$version")
else
    # Increment patch version for direct pushes
    new_version=$(increment_patch_version "$version")
fi

new_build_number=$((build_number + 1))

# Update package.json with the new version and build number
jq --arg new_version "$new_version" --argjson new_build_number "$new_build_number" \
   '.version = $new_version | .buildNumber = $new_build_number' package.json > tmp.json && mv tmp.json package.json

echo "Updated package.json with version: $new_version and buildNumber: $new_build_number"