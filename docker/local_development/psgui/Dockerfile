FROM node:14.20.1-alpine3.15 AS development
ENV NODE_ENV development

RUN apk update
RUN apk add git

WORKDIR /psgui

RUN git clone https://github.com/perfsonar/psgui.git .

# Cache and Install dependencies
# COPY package.json .
# COPY yarn.lock .
RUN yarn install
# Copy app files
# COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "yarn", "start" ]
