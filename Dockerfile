FROM node:8.14-alpine

USER root

RUN apk add --no-cache openssh-client git

WORKDIR /app
ADD . /app

RUN npm install
RUN npm install --only=dev

EXPOSE 3000
CMD [ "node", "server.js" ]
