# Etapa 1: build + tests (stage)
FROM node:18-alpine AS stage

WORKDIR /app

# Copiamos dependencias primero para aprovechar caché
COPY package.json package-lock.json ./
# npm ci es más rápido y reproducible que npm install
RUN npm ci

# Copiamos el resto del código
COPY . .

# Ejecutamos pruebas (si fallan, la build se detiene)
RUN npm test

# Ejecutamos build (por ejemplo, compilar TypeScript)
RUN npm run build

# Etapa 2: producción (prod)
FROM node:18-alpine AS prod

WORKDIR /app

# Definimos variables de entorno
ENV NODE_ENV=production \
    PORT=8080

# Copiamos solo lo necesario desde la etapa de build
COPY --from=stage /app/dist ./dist
COPY package.json package-lock.json ./

# Instalamos solo dependencias de producción
RUN npm ci --only=production

# Exponemos el puerto configurado en la app
EXPOSE 8080

# Comando de inicio
CMD ["node", "dist/index.js"]
