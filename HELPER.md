# Help Guide - Weather Intelligence Docker Deployment

WSL-Based Local Run and Docker Validation

## Purpose

This guide gives learners a step-by-step process to build a Weather Intelligence App in Google AI Studio App Build, download the source code, run it locally, Dockerize it, and validate the local container deployment.

## Important WSL and Docker Requirement

For this assignment, all local setup, npm, and Docker commands must be run from Ubuntu WSL. Docker Engine must be installed and run inside Ubuntu WSL. Do not use Docker Desktop for this assignment, and do not run docker build or docker run from Windows PowerShell or Windows Command Prompt.

## Prerequisites

- Google AI Studio access
- Ubuntu WSL installed and working
- Node.js LTS and npm installed inside Ubuntu WSL
- Docker Engine installed and running inside Ubuntu WSL
- A code editor such as VS Code with WSL support
- Internet access for Open-Meteo API calls

## Steps

### Step 1: Build the app in Google AI Studio App Build
1. Open Google AI Studio App Build.
2. Create a new app.
3. Use the Weather Intelligence App prompt from the Level 2 assignment.
4. Generate the app and test it inside AI Studio.
5. Confirm that city search, current weather, forecast, charts, and recommendations are visible.

### Step 2: Download the source code
1. In Google AI Studio, use the download/export source option.
2. Save the downloaded zip file to your assignment workspace.
3. Move or extract the project into Ubuntu WSL, preferably under ~/projects.
4. Rename the folder to weather-intelligence if needed.

Example WSL commands:

```bash

mkdir -p ~/projects
cd ~/projects
unzip weather-intelligence.zip -d weather-intelligence
cd weather-intelligence

```

### Step 3: Verify Node.js and npm

- Open Ubuntu WSL and run:

```bash

pwd

```

- Run these commands inside Ubuntu WSL:

```bash

node -v
npm -v

```

- If npm is not recognized inside WSL, install Node.js LTS inside WSL using an IT-approved method. Do not rely on Windows Node.js for this assignment.

### Step 4: Run the app locally

- Go to the project folder inside Ubuntu WSL:

```bash

cd ~/projects/weather-intelligence

```

- Install dependencies:

```bash

npm install

```

- Start the development server:

```bash

npm run dev

```

- Open the browser URL shown in the terminal. Common defaults are:
  - ``http://localhost:3000``
  - ``http://localhost:5173``

### Step 5: Inspect the project

- Check that the project has files similar to these:

| File or folder | Purpose |
|:---------------|:--------|
| ``src/`` | React source code | 
| ``src/App.tsx`` or ``src/App.jsx`` | Main app logic | 
| ``src/components/``	| Reusable UI components | 
| ``package.json`` | Scripts and dependencies | 
| ``vite.config.ts`` or ``vite.config.js`` | Vite configuration | 
| ``README.md``	| Run and setup instructions | 

### Step 6: Add Docker files

- Create ``Dockerfile`` in the project root:

```docker

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

```

- Create ``.dockerignore``:

```text

node_modules
dist
.git
.env
.env.local
npm-debug.log

```

- Create ``nginx.conf``:

```text

server {
listen 8080;
server_name _;
root /usr/share/nginx/html;
index index.html;
location / { try_files $uri $uri/ /index.html; }
location = /health { access_log off; add_header Content-Type text/plain; return 200 "ok\n"; }
}

```

### Step 7: Verify Docker access inside WSL

- Run these commands inside Ubuntu WSL:

```bash

docker --version
docker ps

```

- If Docker is not available inside WSL, follow the Docker Engine setup reference in the WSL and Docker Setup Guidelines.

### Step 8: Build the Docker image

- Run this from the WSL project root:

```bash

docker build -t weather-intelligence .

```

### Step 9: Run the Docker container

```bash

docker run --rm -p 8080:8080 weather-intelligence

```

- Open: ``http://localhost:8080``
- Health check: ``http://localhost:8080/health``

### Step 10: Validate the app

| Check	| Expected Result |
|:------|:----------------|
| Run ``pwd`` in terminal	| Path shows Linux workspace such as ``/home/<username>/projects/weather-intelligence`` |
| Run ``node -v`` and ``npm -v`` | Versions display inside WSL |
| Run ``docker --version`` | Docker command works inside WSL |
| Search Chennai | Current weather and forecast display |
| Search London	| Location and forecast update |
| Search invalid city	| City not found message appears |
| Refresh browser	| App still loads inside Docker container |
| Open ``/health`` | Returns ok |
| Resize browser | Layout remains usable | 

## Troubleshooting

| Issue	| Likely Cause | Fix |
|:------|:-------------|:----|
| npm is not recognized in WSL | Node.js/npm installed only on Windows or not installed in WSL | Install Node.js LTS inside WSL using an IT-approved method |
| docker is not recognized in WSL	| Docker Engine is not installed inside Ubuntu WSL or PATH is not configured | Follow the WSL Docker Engine setup reference. Contact IT Helpdesk if installation is blocked or fails. |
| Docker daemon not running | Docker Engine service is stopped inside WSL	| Run sudo service docker start or sudo systemctl start docker if systemd is enabled, then retry docker ps. Contact IT if the service cannot start. |
| Port already allocated | Another app is using the port | Use docker run --rm -p 8081:8080 weather-intelligence |
| Weather does not load	| Network or API issue | Check internet connection and try another city |
| Blank page in Docker | Build failed or SPA routing missing | Check docker build logs and nginx.conf try_files rule |
| Slow file operations | Project is stored under /mnt/c	Move project to WSL filesystem, for example ~/projects/weather-intelligence |

