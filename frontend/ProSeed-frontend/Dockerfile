#Build frontend
FROM node:22-alpine
WORKDIR /app/frontend/ProSeed-frontend
COPY package*.json ./
RUN npm ci
COPY / .
EXPOSE 3000
CMD ["npm", "start"]