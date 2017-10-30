FROM node:7.1.0-slim

# Create app directory
WORKDIR /var/lib/sdk
COPY ./package.json /var/lib/sdk/
COPY ./webpack* /var/lib/sdk/
RUN npm install npm@4.0.2 --quiet
RUN npm install --quiet
RUN npm run bundle-examples
RUN npm run build-examples

CMD ["npm", "start"]
