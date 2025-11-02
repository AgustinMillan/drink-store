# Usar imagen base de Node.js LTS
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (todas para desarrollo, solo producción para producción)
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; then \
      npm install; \
    else \
      npm ci --only=production; \
    fi

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
