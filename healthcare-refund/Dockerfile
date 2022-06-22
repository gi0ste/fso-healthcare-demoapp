FROM openjdk:11-jre-slim
ARG JAR_FILE=target/*.jar
COPY /target/refundService-1.0.jar /
EXPOSE 5050/tcp
ENTRYPOINT ["java","-jar","refundService-1.0.jar"]