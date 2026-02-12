FROM node:20-alpine

LABEL version="1.0"
LABEL description="MCP server for todo app and tyre search"
LABEL maintainer="umar.mujawar@michelin.com"

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV USE_HTTP=true
ENV PORT=3000

EXPOSE 3000


CMD ["node", "server/server.js"]
