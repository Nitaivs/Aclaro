FROM node:21 AS frontend-builder
WORKDIR /app/frontend/JSFrontend
COPY frontend/JSFrontend/package*.json ./
RUN npm install
COPY frontend/JSFrontend/ ./
RUN npm run build

FROM eclipse-temurin:21
WORKDIR /app
RUN apt-get update && \
    apt-get install -y \
    curl \
    unzip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY  backend/proseed ./backend/proseed
WORKDIR /app/backend/proseed
ENV GRADLE_VERSION=8.14
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp && \
    unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip && \
    rm /tmp/gradle-${GRADLE_VERSION}-bin.zip
ENV PATH="${PATH}:/opt/gradle/gradle-${GRADLE_VERSION}/bin"

COPY --from=frontend-builder /app/frontend/JSFrontend/dist ./src/main/resources/static


RUN gradle build -x test --no-daemon

RUN ls -l build/libs

EXPOSE 8080

CMD ["java", "-jar", "build/libs/proseed-0.0.1-SNAPSHOT.jar"]