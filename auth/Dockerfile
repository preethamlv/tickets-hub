# Specify a base image
FROM node:16.13.1-alpine

WORKDIR /usr/app

# Install some depenendencies
COPY ./package.json ./
RUN npm install --only=prod
COPY ./ ./

# Default command
CMD ["npm", "start"]