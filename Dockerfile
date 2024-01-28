FROM node:21

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev


COPY package.json /usr/src/app/
RUN npm install
COPY src /usr/src/app/src

EXPOSE 3000
CMD ["npm", "run", "start"]