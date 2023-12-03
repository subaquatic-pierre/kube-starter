#! /bin/sh

set -x

ssh aws-ec2-instance 'kubectl apply -k ~/kubernetes --force'