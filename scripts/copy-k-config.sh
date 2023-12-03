#! /bin/bash

set -x

# First remove old dir
ssh aws-ec2-instance rm -rf ~/kubernetes

# Copy new dir
scp -r -v ./kubernetes aws-ec2-instance:~/