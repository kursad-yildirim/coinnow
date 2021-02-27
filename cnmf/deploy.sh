#!/bin/bash
REGISTRY='tripko'
CONTAINER='/usr/bin/podman'
WORKDIR='/home/workspace'
APP="coinnow"
TAG=$1
PORT='52380'
COINNOW_DB_IP=$(podman ps | grep "coinNow-mongo-db" | awk '{print $1}'| xargs podman inspect| grep IPAddress|awk '{print $2}'| awk -F "\"" '{print $2}')


cat > $WORKDIR/$APP/code.dev/Dockerfile << EOLDOCKERFILE
FROM node:lts-alpine3.13

WORKDIR /usr/src/app

ENV COINNOW_DB_IP=$COINNOW_DB_IP

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 52380

CMD [ "npm", "start" ]
EOLDOCKERFILE


$CONTAINER build $WORKDIR/$APP/code.dev -t $REGISTRY/$APP:$TAG >/dev/null 2>&1

$CONTAINER ps -a | grep $APP | awk '{print $1}'| xargs podman stop
$CONTAINER ps -a | grep $APP | awk '{print $1}'| xargs podman rm

$CONTAINER run --name $APP-$TAG -d $REGISTRY/$APP:$TAG