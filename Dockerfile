# build environment
# =============================================================================
FROM node:19.2.0-alpine3.15 as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY front/package.json ./
COPY front/package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY front/. ./
RUN npm run build


# production environment
# =============================================================================
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY server/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]