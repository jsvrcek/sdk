FROM node:7.1.0-slim

# Create app directory
WORKDIR /var/lib/sdk
COPY ./package.json /var/lib/sdk/
COPY ./webpack* /var/lib/sdk/
RUN apt-get update && apt-get install -y ruby git libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++
RUN npm install npm@4.0.2 --quiet
RUN npm install --quiet


CMD ["npm", "start"]
