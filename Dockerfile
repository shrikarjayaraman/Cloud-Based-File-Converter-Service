# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the microservice scripts to the container
COPY merge-pdf.js ./
COPY convert-jpg-to-png.js ./
COPY remove-background-from-png.js ./
COPY start.js ./

# Set the default command for the container
CMD [ "node", "start.js" ]