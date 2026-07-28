📚 Gestión de Libros - Prueba Técnica
Descripción
Esta aplicación es una solución Full Stack para la administración de un catálogo de libros. 
Permite a los usuarios autenticarse de forma segura mediante JSON Web Tokens (JWT) y realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre la entidad "Libro".

Arquitectura
La solución está diseñada bajo un modelo de desacoplamiento:  
Frontend: Desarrollado en React, consume la API REST mediante Axios.  
Backend: API REST construida en Spring Boot que gestiona la lógica de negocio y seguridad.  
Base de Datos: Persistencia de datos utilizando PostgreSQL.  
Comunicación: Intercambio de información seguro vía HTTP + JWT.  

Tecnologías Utilizadas
Backend: Java 17+, Spring Boot, Spring Security, JWT, Maven.  
Frontend: React, Vite, React Router, Axios, Tailwind CSS.  Base de Datos: PostgreSQL.  
Contenedores: Docker, Docker Compose.  
Librerías principales: Springdoc OpenAPI (Swagger), Flyway (Migraciones).

Requisitos
Para ejecutar el proyecto, asegúrate de tener instalado:
Docker
Docker Compose
Git

Cómo ejecutar el proyecto
Ejecuta los siguientes comandos en la raíz del repositorio:  
Bash
git clone 
cd prueba-tecnica-itops
docker compose up -d

Acceso a los servicios:
Frontend: http://localhost:5173  
Backend API: http://localhost:8080  
Swagger (Documentación): http://localhost:8080/swagger-ui.html  

Credenciales de prueba
Usuario: admin  
Password: admin123  

Estructura del proyecto
/backend: Código fuente de Spring Boot, controladores, repositorios, seguridad y configuración de Flyway.
/frontend: Código fuente de React, componentes, lógica de autenticación y estilos.
/docker-compose.yml: Orquestación de contenedores para levantar el entorno completo.

Decisiones Técnicas
Seguridad: Se implementó JWT (JSON Web Tokens) para asegurar que solo usuarios autenticados puedan acceder a los endpoints del CRUD.  
Migraciones: Se utilizó Flyway para garantizar que la base de datos se configure automáticamente al iniciar el contenedor.  
Despliegue: Docker Compose permite un despliegue unificado sin configuraciones manuales adicionales.  

Uso de Inteligencia Artificial
Para el desarrollo de este proyecto, se utilizó Gemini como asistente de desarrollo para:
Backend: Estructura de controladores, y configuración de migraciones con Flyway.
Frontend: Diseño de componentes.
Validación: Todo el código generado fue revisado, probado y validado manualmente para asegurar su correcto funcionamiento y cumplimiento de los requisitos técnicos.
