#! /bin/bash

set -x

# First remove old dir
sshpass -p m3AK9gX5v1w2xI ssh thor rm -rf ~/kubernetes

# Copy new dir
sshpass -p m3AK9gX5v1w2xI scp -r -v ./kubernetes thor:~/