#Build frontend
FROM node:22-alpine
WORKDIR /app/frontend/ProSeed-frontend
COPY frontend/ProSeed-frontend/package*.json ./
RUN npm ci
COPY frontend/ProSeed-frontend/ .
EXPOSE 3000
CMD ["npm", "start"]


#Build backend
FROM gradle:8.6-jdk21 AS backend-builder
# This image of Gradle is vulnearble and does not come with an updated version of Gradle
WORKDIR /app/backend/proseed
COPY backend/proseed/gradlew .
COPY backend/proseed/gradlew.bat .
COPY backend/proseed/settings.gradle.kts .
COPY backend/proseed/build.gradle.kts .
COPY backend/proseed/gradle ./gradle

COPY backend/proseed/src ./src

RUN ./gradlew clean bootJar -x test

#Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app/backend/proseed
COPY backend/proseed/ .
EXPOSE 8080
CMD ["./gradlew", "bootRun", "-x", "test"]