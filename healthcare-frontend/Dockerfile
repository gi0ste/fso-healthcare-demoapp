# Use node as base image
FROM node:14.18.3-alpine

# Set the working directory to /
WORKDIR /

# Copy Package JSON
COPY package*.json ./

# Install requirements
RUN npm install 

# Copy all files
ADD . /

# Expose port 5000
EXPOSE 5000/tcp

# Run it
CMD [ "node",  "shim.js"]


