#Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend/ProSeed-frontend
COPY frontend/ProSeed-frontend/package*.json ./
RUN npm ci
COPY frontend/ProSeed-frontend/ .
RUN npm run build

