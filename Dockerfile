FROM node:lts

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

ENV NODE_ENV=production

COPY . .

RUN yarn build

RUN ls -a

EXPOSE 3000

CMD ["yarn", "start"]