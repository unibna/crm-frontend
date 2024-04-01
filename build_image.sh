#!/bin/bash

SERVICE_NAME=crm-$1
VERSION=$2
PROJECT_NAME="unibna"
IMAGE_NAME="$PROJECT_NAME/$SERVICE_NAME:$VERSION"


if [[ "$1" == "frontend" ]];
then
    echo "Building $SERVICE_NAME sync image..."
    docker build \
    --platform linux/amd64 \
    -t $IMAGE_NAME \
     -f dockerfiles/frontend.dockerfile . 
    docker push $IMAGE_NAME
else
    echo "seriver is not supported. service_name: $1"
fi
