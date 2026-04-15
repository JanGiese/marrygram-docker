#!/bin/bash

export FRONTEND_TAG=latest
export BACKEND_TAG=latest
export MEDIA_COMPRESSOR_TAG=latest

docker-compose -f compose.yml -f compose.test.yml "$@"
