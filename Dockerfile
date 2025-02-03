# Use a base image with Python and Node.js preinstalled
FROM python:3.11-slim

# Install curl, build-essential, fontconfig, python3-pip, Node.js (npm), and other utilities
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    fontconfig \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    gnupg \
    ca-certificates \
    lsb-release \
    && apt-get clean

# Install Node.js and npm (Node.js v18)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Install yt-dlp globally (with curl)
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod +x /usr/local/bin/yt-dlp

# Set up the working directory
WORKDIR /app

# Copy package.json and package-lock.json for Node.js dependencies
COPY package.json /app/

# Install Node.js dependencies
RUN npm install

# Copy the Python requirements file (if it exists)
COPY requirements.txt /app/

# Install Python dependencies (requests, yt-dlp if needed)
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Ensure the correct path for binaries
RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile

# Expose any necessary port (if your app uses one)
EXPOSE 3000

# Run your Node.js application (replace with your start command if different)
CMD ["node", "index.js"]
