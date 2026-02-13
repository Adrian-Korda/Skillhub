## stage 1: build the java application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

## copying the project files
COPY backend/pom.xml .
COPY backend/src ./src

## building the jar file and skipping tests for speed
RUN mvn clean package -DskipTests

## stage 2: setup the runtime environment
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

## installing python3 and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

## copying the python script folder
COPY MarketPredictor /app/MarketPredictor

## installing python libraries
RUN pip3 install -r /app/MarketPredictor/requirements.txt

## copying the compiled jar from stage 1
COPY --from=build /app/target/*.jar app.jar

## exposing the port
EXPOSE 8080

## starting the application
ENTRYPOINT ["java", "-jar", "app.jar"]