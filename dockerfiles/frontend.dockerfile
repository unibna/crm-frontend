# Set the base image to node:14-alpine
FROM node:14-alpine as build

# Specify where our app will live in the container
COPY package.json yarn.lock /app/
WORKDIR /app
RUN yarn --pure-lockfile
COPY . .
RUN yarn build

# Prepare nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/k8s/dev/nginx.conf /etc/nginx/conf.d
# Fire up nginx
EXPOSE 80
# EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
