FROM node:18.18.1 as build

COPY package.json ./
COPY package-lock.json ./
COPY src ./src
COPY .env* ./
COPY index.html ./
COPY ts* ./
COPY vite.config.ts ./

RUN  \
    --mount=type=cache,node_modules=/tmp/bo-fe/node_modules \
    npm install && npm run build:staging

FROM nginx
COPY --from=build ./dist /usr/share/nginx/html
COPY docker/nginx/config/default_prod.conf /etc/nginx/conf.d/default.conf
