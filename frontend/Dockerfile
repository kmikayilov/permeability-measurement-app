# Use an official Node runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install node dependencies
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app
# CMD ["npm", "start"]
CMD ["npm", "run", "build"]