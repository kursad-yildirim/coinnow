#!/bin/bash
REGISTRY='registry.8-mega.io'
CONTAINER='/usr/bin/docker'

WORKDIR='/home/workspace'
APP="8-mega-kurus"
MICROSERVICE="getsymbolprice"
TAG=$1
PORT='52380'

$CONTAINER build $WORKDIR/$APP/$MICROSERVICE/code.dev -t $REGISTRY/$MICROSERVICE-$APP:$TAG
$CONTAINER push $REGISTRY/$MICROSERVICE-$APP:$TAG


#apiVersion: v1
#kind: Pod
#metadata:
#  name: get-symbol-price
#  namespace: 8-mega-apps
#  labels:
#    app: 8-mega-kurus
#    microservice: getsymbolprice
#spec:
#  containers:
#    - name: 8mgk-gsp
#      image: registry.8-mega.io/getsymbolprice-8-mega-kurus:0.3
#      ports:
#        - name: 8m-nodejs-port
#          protocol: TCP
#          containerPort: 52380
#kubectl -n 8-mega-apps edit deployment set --image=registry.8-mega.io/getsymbolprice-8-mega-kurus:0.3
#kubectl create -f kube.resource.files/pod.yaml
#kubectl -n 8-mega-apps delete pod get-symbol-price
