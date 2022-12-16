FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

CMD ["node","dist/app/index.js"]
