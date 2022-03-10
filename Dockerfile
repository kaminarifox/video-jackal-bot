FROM node:14-alpine

RUN apk update && apk add ffmpeg

WORKDIR /app

RUN mkdir /tmp/videos && \
    mkdir /var/lib/telegram-bot-api

COPY *.json /app/
RUN npm install

COPY src /app/src

ENTRYPOINT ["npm", "run", "start"]

