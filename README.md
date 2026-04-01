# 🐍 Backend - PetAdopt

## 📌 Descripción
Este proyecto corresponde al backend desarrollado con Django y Django REST Framework.  
Forma parte del trabajo práctico inicial para configurar un entorno de desarrollo funcional.

El sistema permite:
- Gestionar usuarios
- Administrar datos desde el panel de Django
- Servir como base para una API REST

---

## ⚙️ Tecnologías utilizadas
- Python 3
- Django
- Django REST Framework
- SQLite (base de datos inicial)

---

## 🚀 Instalación

1. Clonar el repositorio:
git clone https://github.com/romerobruno/PetAdopt.git

2. Entrar al proyecto:
cd PetAdopt

3. Crear entorno virtual:
py -m venv venv

4. Activar entorno:
venv\Scripts\Activate.ps1

5. Instalar dependencias:
py -m pip install -r requirements.txt

6. Aplicar migraciones:
py manage.py migrate

7. Crear superusuario:
py manage.py createsuperuser

---

## ▶️ Ejecución

Levantar el servidor:
py manage.py runserver

Acceder a:
- http://127.0.0.1:8000/
- http://127.0.0.1:8000/admin/

---

## 📁 Estructura del proyecto

- config/ → configuración principal
- core/ → aplicación base
- manage.py → gestor de comandos

---

## 🧠 Notas
Este proyecto es la base para futuras funcionalidades como:
- Modelado de datos
- API REST
- Conexión con frontend

---