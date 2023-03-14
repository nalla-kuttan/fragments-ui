# Build the fragments-ui web app and serve it via parcel 

# Stage 0: install the base dependencies

# FROM instruction specifies the parent (or base) image to use as a starting point for our own image

FROM node:18.14.2-alpine@sha256:f8a51c36b0be7434bbf867d4a08decf0100e656203d893b9b0f8b1fe9e40daea AS dependencies

ENV NODE_ENV=production
#
LABEL maintainer="Ruban Manoj <ruban-manoj-paul@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 1234 in our service
#ENV PORT=1234

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# define and create our app's working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

##########################################################################################
# Stage 1: build the site

FROM node:18.14.2-alpine@sha256:f8a51c36b0be7434bbf867d4a08decf0100e656203d893b9b0f8b1fe9e40daea AS builder
# define and create our app's working directory
WORKDIR /app

# Copy the generated dependencies(node_modules/)
COPY --chown=node:node --from=dependencies /app /app

# Copy the source code
COPY --chown=node:node . .

RUN npm install -g parcel@2.8.3

RUN npm install

# Build the site, creating /build
RUN npx parcel build src/index.html

##########################################################################################
# Stage 2: Serving the built site

FROM nginx:1.22.0-alpine@sha256:addd3bf05ec3c69ef3e8f0021ce1ca98e0eb21117b97ab8b64127e3ff6e444ec AS deploy

COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

# Health check to see if the docker instance is healthy
HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost || exit 1