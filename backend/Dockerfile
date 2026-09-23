# ==========================================
# ÉTAPE 1 : Build de l'application (Builder)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# 1. Optimisation du cache : on copie le pom.xml et on télécharge les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. On copie les sources et on compile le .jar (en sautant les tests pour aller plus vite)
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# ÉTAPE 2 : Image finale d'exécution (Runner)
# ==========================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# On copie uniquement le fichier .jar produit à l'étape 1
COPY --from=builder /app/target/*.jar app.jar

# On documente le port exposé par Spring Boot
EXPOSE 8080

# Commande pour démarrer l'application Java
ENTRYPOINT ["java", "-jar", "app.jar"]
