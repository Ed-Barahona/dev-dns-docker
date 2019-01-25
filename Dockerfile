# Use an official Node runtime as a parent image
FROM node

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install npm
RUN npm install

# Make port available to the world outside this container
EXPOSE 53

# Run app when the container launches
CMD ["node", "index.js"]