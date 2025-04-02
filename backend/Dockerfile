# Most likely need node:20 not alpine for sqlite
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

# Start the backend with nodemon for hot reloading
CMD ["npx", "nodemon", "src/index.js"]