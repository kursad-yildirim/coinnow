#!/bin/bash
REGISTRY='registry.8-mega.io'
CONTAINER='/usr/bin/docker'
WORKDIR='/home/workspace'
APP="home-crypto"
MICROSERVICE="getsymbolprice"
TAG=$1
APPDIR=$WORKDIR/$APP/$MICROSERVICE
NAMESPACE="8-mega-apps"
DBNAME="coin-prices";
DBSERVICENAME="svc-mongodb";
DBNAMESPACE="8-mega-data";
DBPORT=27017;
DBREQUIRED='coinPriceTime';

# Create Dockerfile
cat > $APPDIR/code.dev/Dockerfile << EOLDOCKERFILE
FROM node:lts-alpine3.13
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
EOLDOCKERFILE
# Build and push docker image
sudo $CONTAINER build $WORKDIR/$APP/$MICROSERVICE/code.dev -t $REGISTRY/$MICROSERVICE-$APP:$TAG
sudo $CONTAINER push $REGISTRY/$MICROSERVICE-$APP:$TAG

# delete existing  kube resources
rm -R $APPDIR/kube.resource.files/*.yaml
kubectl -n $NAMESPACE delete cronjob $MICROSERVICE
kubectl -n $NAMESPACE delete configmap $MICROSERVICE

# Create k8s resource  yaml files
cat > $APPDIR/kube.resource.files/$MICROSERVICE-cronjob.yaml << EOLPODYAML
apiVersion: batch/v1
kind: CronJob
metadata:
  name: $MICROSERVICE
  namespace: $NAMESPACE
  labels:
    app: $APP
    microservice: $MICROSERVICE
spec:
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  schedule: "0 */1 * * *"
  jobTemplate:
    spec:
      template:
        metadata:
          labels:
            app: $APP
            microservice: $MICROSERVICE
        spec:
          containers:
          - name: $MICROSERVICE-container
            image: $REGISTRY/$MICROSERVICE-$APP:$TAG
            imagePullPolicy: IfNotPresent
            envFrom:
             - configMapRef:
                 name: $MICROSERVICE
          restartPolicy: OnFailure
EOLPODYAML
cat > $APPDIR/kube.resource.files/$MICROSERVICE-configmap.yaml << EOLCONFIGMAPYAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: $MICROSERVICE
  namespace: $NAMESPACE
  labels:
    app: $APP
    microservice: $MICROSERVICE
data:
  DB_NAME: $DBNAME
  DB_SVC_NAME: $DBSERVICENAME
  DB_NAMESPACE: $DBNAMESPACE
  DB_PORT: "$DBPORT"
  DB_REQUIRED: $DBREQUIRED
EOLCONFIGMAPYAML

# create new kube resources
kubectl create -f $APPDIR/kube.resource.files/$MICROSERVICE-configmap.yaml
kubectl create -f $APPDIR/kube.resource.files/$MICROSERVICE-cronjob.yaml
