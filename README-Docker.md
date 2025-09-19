# Frontend Docker Setup

Este directorio contiene la configuración Docker para el frontend Angular de TodoApp.

## 🚀 Inicio Rápido

### Opción 1: Script Automatizado
```bash
./docker-build.sh
```

### Opción 2: Comandos Manuales
```bash
# Construir imagen
docker build -t todoapp-frontend .

# Ejecutar contenedor
docker run -d \
  --name todoapp-frontend-container \
  -p 4200:80 \
  todoapp-frontend
```

## 📋 Comandos Útiles

### Ver logs del contenedor
```bash
docker logs todoapp-frontend-container
```

### Detener el contenedor
```bash
docker stop todoapp-frontend-container
```

### Eliminar el contenedor
```bash
docker rm todoapp-frontend-container
```

### Eliminar la imagen
```bash
docker rmi todoapp-frontend
```

### Acceder al contenedor (debugging)
```bash
docker exec -it todoapp-frontend-container sh
```

## 🔧 Configuración

### Puertos
- **Contenedor**: Puerto 80 (nginx)
- **Host**: Puerto 4200 (configurable en script)
- **Acceso**: http://localhost:4200

### Variables de Entorno (Opcionales)
```bash
# Cambiar puerto host
docker run -d \
  --name todoapp-frontend-container \
  -p 8080:80 \
  todoapp-frontend
```

## 📁 Estructura de Archivos

```
frontend/
├── Dockerfile              # Configuración Docker multi-stage
├── nginx.conf              # Configuración optimizada de nginx
├── .dockerignore           # Archivos excluidos del build
├── docker-build.sh         # Script automatizado
└── README-Docker.md        # Esta documentación
```

## 🔧 Arquitectura del Build

### Multi-stage Build
1. **Stage 1 (build)**: Node.js 18 Alpine
   - Instala dependencias
   - Compila aplicación Angular
   
2. **Stage 2 (production)**: Nginx Alpine
   - Copia archivos compilados
   - Configuración optimizada de nginx
   - Imagen final ligera (~25MB)

### Características
- ✅ **Gzip compression** para archivos estáticos
- ✅ **Cache headers** optimizados
- ✅ **Security headers** incluidos
- ✅ **Angular routing** soportado (SPA)
- ✅ **Health check** endpoint
- ✅ **Logs** estructurados

## 🔍 Troubleshooting

### Problema: "Cannot GET /"
```bash
# Verificar que nginx está corriendo
docker logs todoapp-frontend-container

# Verificar archivos en contenedor
docker exec -it todoapp-frontend-container ls -la /usr/share/nginx/html
```

### Problema: Rutas de Angular no funcionan
- El `nginx.conf` incluye `try_files` para manejar rutas SPA
- Verificar que el archivo esté copiado correctamente

### Problema: Build falla
```bash
# Limpiar cache de Docker
docker system prune -f

# Reconstruir sin cache
docker build --no-cache -t todoapp-frontend .
```

## 🌐 Producción

### Consideraciones para Deploy
1. **Variables de entorno**: Configurar endpoint del backend
2. **SSL/HTTPS**: Usar nginx con certificados SSL
3. **Load Balancer**: Configurar múltiples instancias
4. **Monitoring**: Agregar health checks

### Ejemplo con variables de entorno
```bash
docker run -d \
  --name todoapp-frontend-prod \
  -p 80:80 \
  -e BACKEND_URL=https://api.todoapp.com \
  todoapp-frontend
```
