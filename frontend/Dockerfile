# ==========================================
# ÉTAPE 1 : Build de l'application (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Optimisation du cache : on copie package.json et package-lock.json
COPY package*.json ./
RUN npm ci

# 2. On copie le code source et on compile la version de production (dist)
COPY . .
RUN npm run build

# ==========================================
# ÉTAPE 2 : Serveur web Nginx (Production)
# ==========================================
FROM nginx:alpine

# On copie notre configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# On copie les fichiers statiques générés à l'étape 1 dans le dossier servi par Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx écoute par défaut sur le port 80
EXPOSE 80

# On lance Nginx en premier plan (daemon off)
CMD ["nginx", "-g", "daemon off;"]
