# FROM node

# ENV MONNGO_DB_USERNAME=admin \
#     MONNGO_DB_PWD=qwerty

# RUN mkdir -p testapp

# COPY . /docker-testapp-main

# CMD ["node", "/docker-testapp-main/server.js"]

FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD ["node", "server.js"]
# This Dockerfile sets up a Node.js application in a Docker container.
