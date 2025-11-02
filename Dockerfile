#Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend/ProSeed-frontend
COPY frontend/ProSeed-frontend/package*.json ./
RUN npm ci
COPY frontend/ProSeed-frontend/ .
RUN npm run build

#Build backend
FROM gradle:8.6.5-jdk21 AS backend-builder
WORKDIR /app/backend/proseed
COPY backend/proseed/gradlew .
COPY backend/proseed/gradlew.bat .
COPY backend/proseed/settings.gradle.kts .
COPY backend/proseed/build.gradle.kts .
COPY backend/proseed/gradle ./gradle

COPY backend/proseed/src ./src
COPY --from=frontend-builder /app/frontend/ProSeed-frontend/build ./src/main/resources/static

RUN ./gradlew clean bootJar -x test

#Final build
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/proseed/build/libs/*.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]