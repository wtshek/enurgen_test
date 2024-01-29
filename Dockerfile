FROM node:21

# Create a directory for the application and set it as the working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install necessary dependencies for canvas library
RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Copy package.json and install dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy application source code into the container
COPY src /usr/src/app/src

EXPOSE 3000

# Define the default command to run when the container starts
CMD ["npm", "run", "start"]
