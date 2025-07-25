# Etapa 1: Servir la aplicación con Nginx
# Usamos una imagen ligera de Nginx
FROM nginx:alpine

# Eliminar la configuración por defecto de Nginx para evitar conflictos
RUN rm /etc/nginx/conf.d/default.conf

# Copiar tu configuración personalizada de Nginx
# (El log de tu build indica que tienes este archivo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de la aplicación ya compilados por Cloud Build
# La ruta de origen (dist/front-panaderia/browser) debe coincidir con el "outputPath" en tu archivo angular.json
COPY dist/panaderia/. /usr/share/nginx/html/

# Exponer el puerto que usa Nginx (generalmente 80 u 8080)
EXPOSE 8080
