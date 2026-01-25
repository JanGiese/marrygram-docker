#!/bin/bash

export FRONTEND_TAG=development
export BACKEND_TAG=development
export MEDIA_COMPRESSOR_TAG=latest

docker-compose -f compose.yml -f compose.test.yml "$@"
