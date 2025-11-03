FROM node:21 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ProSeed-frontend/package*.json ./
RUN npm install
COPY frontend/ProSeed-frontend/ ./
RUN npm run build

FROM eclipse-temurin:21
WORKDIR /app

COPY  backend/proseed/ ./backend/proseed/
WORKDIR /app/backend
ENV GRADLE_VERSION=8.14
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp \
    && unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip \
    && rm /tmp/gradle-${GRADLE_VERSION}-bin.zip
ENV PATH="/opt/gradle/gradle-${GRADLE_VERSION}/bin"

COPY --from=frontend-builder /app/frontend/dist ./../frontend/dist

RUN gradle build -x test --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "build/libs/app-0.0.1-SNAPSHOT.jar"]