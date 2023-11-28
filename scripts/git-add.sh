#! /bin/bash

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

run_commit(){
  message="$1"
  git add .
  git commit -m "$message"
  git push

}

# Usage:
#   build-docker 0.12                   

run() {
    message="$1"

    [ -z "$message" ] && die "Commit message not specified"

    # --- ADMIN BACKEND ---

    # Move to the Admin_Backend directory.
    pushd_quiet "Admin_Backend"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    # --- FILEMANAGER BACKEND ---

    # Move to the Filemanager-Backend directory.
    pushd_quiet "Filemanager-Backend"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    # --- MARKETPLACE BACKEND ---

    # Move to the Marketplace_Backend directory.
    pushd_quiet "Marketplace_Backend"
    run_commit  "$message"
    # Back to workdir.
    popd_quiet

    # --- PRODUCT BACKEND ---

    # Move to the Product_Backend directory.
    pushd_quiet "Product_Backend"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    # --- RFX BACKEND ---

    # Move to the RFX_Backend directory.
    pushd_quiet "RFX_Backend"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    # --- USERS BACKEND ---

    # Move to the Users_Backend directory.
    pushd_quiet "Users_Backend"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    # --- REACT FRONTEND ---

    # Move to the Users_Backend directory.
    pushd_quiet "React_FrontEnd"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    # --- REACT FRONTEND ---

    # Move to the Users_Backend directory.
    
    pushd_quiet "THOR-LANDINGPAGE"
    run_commit "$message"
    # Back to workdir.
    popd_quiet

    echo ""
    echo "Changing back to root directory and pushing commit..."
    # Run last commit of root dev repo
    run_commit "$message"

}

run "$1"