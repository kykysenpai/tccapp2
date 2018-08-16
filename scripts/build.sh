#!/bin/bash

. $(dirname "$0")/env.sh

docker run --rm \
    --name scipio_build \
    -v ${PROJECT_ROOT}:/home/node/app \
    -w /home/node/app \
    -u "node" \
    node \
    npm install --verbose
