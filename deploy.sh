#!/bin/bash
CONTAINER='/usr/bin/podman'
WORKDIR='/home/workspace'
APP="coinnow"
TAG=$1
PORT='52380'

$CONTAINER build $WORKDIR/$APP/code.dev -t $APP:$TAG