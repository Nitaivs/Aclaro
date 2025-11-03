FROM gradle:8.10-jdk17-alpine

WORKDIR /app

# Copy Gradle wrapper and project files
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Copy the rest of the project
COPY src src

# Expose default Spring Boot port
EXPOSE 8080

# Run the app in development mode
CMD ["./gradlew", "bootRun", "--no-daemon"]
