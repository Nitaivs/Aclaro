FROM node:21 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ProSeed-frontend/package*.json ./
RUN npm install
COPY frontend/ProSeed-frontend/ ./
RUN npm run build

FROM eclipse-temurin:21
WORKDIR /app