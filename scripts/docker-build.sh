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
  docker --config $HOME/.docker/roman push $full_repo

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

    admin_repo="cdtroman/thor-admin-backend"

    # Move to the Admin_Backend directory.
    pushd_quiet "Admin_Backend"
    run_build "$admin_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- FILEMANAGER BACKEND ---

    filemanager_repo="cdtroman/thor-filemanager-backend"

    # Move to the Filemanager-Backend directory.
    pushd_quiet "Filemanager-Backend"
    run_build "$filemanager_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- MARKETPLACE BACKEND ---

    marketplace_repo="cdtroman/thor-marketplace-backend"

    # Move to the Marketplace_Backend directory.
    pushd_quiet "Marketplace_Backend"
    run_build "$marketplace_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- PRODUCT BACKEND ---

    product_repo="cdtroman/thor-product-backend"

    # Move to the Product_Backend directory.
    pushd_quiet "Product_Backend"
    run_build "$product_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- RFX BACKEND ---

    rfx_repo="cdtroman/thor-rfx-backend"

    # Move to the RFX_Backend directory.
    pushd_quiet "RFX_Backend"
    run_build "$rfx_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- USERS BACKEND ---

    users_repo="cdtroman/thor-users-backend"

    # Move to the Users_Backend directory.
    pushd_quiet "Users_Backend"
    run_build "$users_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- REACT FRONTEND ---

    react_frontend_repo="cdtroman/thor-react-frontend"

    # Move to the Users_Backend directory.
    pushd_quiet "React_FrontEnd"
    run_build "$react_frontend_repo" "$version"
    # Back to workdir.
    popd_quiet

    # --- LANDING PAGE ---

    landingpage_repo="cdtroman/thor-landingpage"

    # Move to the Users_Backend directory.
    pushd_quiet "THOR-LANDINGPAGE"
    run_build "$landingpage_repo" "$version"
    # Back to workdir.
    popd_quiet
}

run "$1"