#! /bin/sh

set -x

sshpass -p m3AK9gX5v1w2xI ssh thor 'kubectl apply -k ~/kubernetes --force'