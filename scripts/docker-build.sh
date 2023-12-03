#!/bin/bash

# This script contains functions for building all docker images 
# and pushing to dockerhub.

die() {
    echo "[ERROR] $1"
    echo "$USAGE" # To be filled by the caller.
    # Kill the caller.
    if [ -n "$TOP_PID" ]; then kill -s TERM "$TOP_PID"; else exit 1; fi
}

pushd_quiet() {
    echo ""
    echo "Changing working directory to ./$1..."
    pushd "$1" &>/dev/null || die "Failed to enter $1."
}

popd_quiet() {
    popd &>/dev/null || die "Failed to return to previous directory."
}

run_build(){
  repo="$1"
  version="$2"

  full_repo="$repo:$version"

  # Build image
  docker build -f Dockerfile.prod . -t $full_repo

  # Push image to docker hub
  docker push $full_repo

  # Update package.json version
#   jq '."version" = "'"$version"'"' package.json > package.json.tmp
#   mv package.json.tmp package.json
}

# Usage:
#   build-docker 0.12                   

run() {
    version="$1"

    [ -z "$version" ] && die "Version tag not specified."

    # --- ADMIN BACKEND ---
    docker_user="docker-user"
    api_repo="$(docker_user)/kube-starter-api"
    www_repo="$(docker_user)/kube-starter-www"

    # Move to the api directory.
    pushd_quiet "api"
    run_build "$api_repo" "$version"
    # Back to workdir.
    popd_quiet

    # Move to the www directory.
    pushd_quiet "api"
    run_build "$www_repo" "$version"
    # Back to workdir.
    popd_quiet

}

run "$1"