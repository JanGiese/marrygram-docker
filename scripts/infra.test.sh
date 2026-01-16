#!/bin/bash

export FRONTEND_TAG=latest
export BACKEND_TAG=latest
export MEDIA_COMPRESSOR_TAG=latest

if [[ "$*" == *"up"* ]]; then
  docker volume rm marrygram-docker_minio-data-test marrygram-docker_db-data-test 2> /dev/null || true
fi

docker-compose -f compose.yml -f compose.test.yml "$@"

if [[ "$*" == *"down"* ]]; then
  docker volume rm marrygram-docker_minio-data-test marrygram-docker_db-data-test 2> /dev/null || true
fi