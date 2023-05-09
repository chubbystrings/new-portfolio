# STAGE 1

FROM node:18.14.0-alpine  AS build

WORKDIR /app

COPY package.json ./

RUN yarn  install

COPY . /app

RUN yarn build


# STAGE 2

FROM node:18.14.0-alpine 

WORKDIR /app

RUN yarn global add webserver.local

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD webserver.local -d ./dist