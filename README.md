🐾 PetAdopt: Sistema Integral de Adopción
PetAdopt es una plataforma web diseñada para digitalizar y agilizar el proceso de adopción de mascotas. El sistema permite gestionar el catálogo de animales, registrar adoptantes y administrar el flujo de solicitudes mediante una arquitectura de tres capas.

🏗️ Arquitectura del Proyecto
El sistema sigue un patrón de Arquitectura de Tres Capas (Client-Server), garantizando la separación de responsabilidades:
Frontend (Capa de Presentación): Desarrollado en React / Vue.js. Maneja la interfaz de usuario y el consumo de la API.
Backend (Capa de Aplicación): Desarrollado en Node.js (Express) / Python. Contiene la lógica de negocio y los controladores REST.
Base de Datos (Capa de Persistencia): PostgreSQL / MySQL. Almacena la información de forma relacional y segura.

Diagrama de Arquitectura (PlantUML)



📊 Modelo de Datos
El sistema se basa en tres entidades principales con relaciones relacionales sólidas:
Usuarios: Almacena adoptantes y administradores.
Mascotas: Registro detallado de animales (especie, edad, estado).
Solicitudes: Entidad intermedia que vincula a un Usuario con una Mascota para formalizar la adopción.

Relaciones:
Usuario (1) : (N) Solicitudes: Un usuario puede aplicar para adoptar varias mascotas.
Mascota (1) : (N) Solicitudes: Una mascota puede recibir múltiples interesados hasta que se apruebe uno.
🛠️ Estructura de las Tablas (SQL)
sql
-- Tabla de Usuarios
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20)
);

-- Tabla de Mascotas
CREATE TABLE Mascotas (
    id_mascota INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    especie VARCHAR(50),
    edad INT,
    estado VARCHAR(20) DEFAULT 'Disponible' -- Disponible, Adoptado, En Proceso
);

-- Tabla de Solicitudes (Relación Intermedia)
CREATE TABLE Solicitudes (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_mascota INT,
    fecha_solicitud DATE,
    estado_solicitud VARCHAR(20) DEFAULT 'Pendiente',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_mascota) REFERENCES Mascotas(id_mascota)
);


