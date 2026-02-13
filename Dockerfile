## stage 1: build the java application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

## copying the project files to the container
COPY backend/pom.xml .
COPY backend/src ./src

## building the jar file and skipping tests for speed
RUN mvn clean package -DskipTests

## stage 2: setup the runtime environment
FROM openjdk:17-slim
WORKDIR /app

## installing python3 and pip manually since this image only has java
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

## copying the python script folder to the container
COPY MarketPredictor /app/MarketPredictor

## installing the required python libraries from requirements.txt
RUN pip3 install -r /app/MarketPredictor/requirements.txt

## copying the compiled jar file from the build stage (stage 1)
COPY --from=build /app/target/*.jar app.jar

## exposing port 8080 so the web service can be accessed
EXPOSE 8080

## starting the spring boot application
ENTRYPOINT ["java", "-jar", "app.jar"]