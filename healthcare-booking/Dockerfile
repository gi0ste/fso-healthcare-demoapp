FROM openjdk:11-jre-slim
ARG JAR_FILE=target/*.jar
COPY /target/bookingService-1.0.jar /
EXPOSE 5001/tcp
ENTRYPOINT ["java","-jar","bookingService-1.0.jar"]