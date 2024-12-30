# Use the official Node.js image as base
FROM node:18

RUN npm install -g prisma

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build


RUN chmod +x docker/entrypoint.sh
# Expose the port that your app runs on
EXPOSE 3300

# Command to run your application
CMD ["bash", "docker/entrypoint.sh"]
