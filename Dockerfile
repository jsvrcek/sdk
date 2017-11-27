FROM node:9.2.0

# Create app directory
WORKDIR /var/lib/sdk
COPY ./package.json /var/lib/sdk/
COPY ./webpack* /var/lib/sdk/
COPY ./tasks/* /var/lib/sdk/tasks/
COPY ./examples /var/lib/sdk/examples
COPY ./config /var/lib/sdk/config
RUN npm install --quiet

RUN npm run build:examples

CMD ["npm", "start"]
