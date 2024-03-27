#! /bin/sh

die() {
    echo "[ERROR] $1"
    echo "$USAGE" # To be filled by the caller.
    # Kill the caller.
    if [ -n "$TOP_PID" ]; then kill -s TERM "$TOP_PID"; else exit 1; fi
}

run() {
    # Source old version
    . ./kubernetes/.version
    old_version=$CURRENT_VERSION

    # Set remote host name
    remote_host="orion"

    # Update with new version
    new_version="$1"
    [ -z "$new_version" ] && die "Version tag not specified."
    echo "CURRENT_VERSION=$new_version" > .version


    echo "Running build for new version $new_version..."

    # Update kube deploy version
    sed -i "s/:${old_version}/:${new_version}/g" kubernetes/deploy.yaml

    # Run docker build
    ./scripts/docker-build.sh "$new_version"

    # Run kube
    ./scripts/kube-exec.sh "$remote_host"
}

run "$1"