#Build backend
FROM gradle:8.6-jdk21 AS backend-builder
WORKDIR /app

# copy sources and wrapper
COPY gradlew .
COPY gradlew.bat .
COPY settings.gradle.kts .
COPY build.gradle.kts .
COPY gradle ./gradle
COPY src ./src

RUN chmod +x ./gradlew && ./gradlew clean bootJar -x test --no-daemon && cp build/libs/*.jar app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app/backend/proseed

COPY --from=backend-builder /app/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]