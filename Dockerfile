FROM node:18

# Create app directory
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --prod

COPY . .

CMD [ "node", "." ]