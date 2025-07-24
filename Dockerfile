# ---- Etapa 1: Construcción (Builder) ----
# Usamos una imagen de Node.js para construir el proyecto Angular
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de definición de dependencias
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Construimos la aplicación para producción. El resultado quedará en /app/dist/front-panaderia/browser
RUN npm run build -- --configuration production

# ---- Etapa 2: Producción (Runner) ----
# Usamos una imagen ligera de Nginx para servir los archivos
FROM nginx:stable-alpine

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos compilados desde la etapa de construcción a la carpeta web de Nginx
COPY --from=builder /app/dist/front-panaderia/browser /usr/share/nginx/html

# Exponemos el puerto 80 para que el contenedor sea accesible
EXPOSE 80

# Comando por defecto para iniciar Nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]