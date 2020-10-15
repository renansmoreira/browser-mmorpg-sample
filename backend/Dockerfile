FROM node:14.13.1-stretch-slim

WORKDIR src
COPY src/index.js src/package.json src/package-lock.json ./
RUN npm i --only=prod

ENTRYPOINT [ "npm", "start" ]
