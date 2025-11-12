# API de Gestión de Tareas

Backend hecho con **Node.js + Express + MySQL** utilizando la arquitectura **MVC**.

## 🚀 Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/usuario/backend-tareas.git
   ```

2. Instalar dependencias:

   ```bash
   git clone https://github.com/usuario/backend-tareas.git
   ```

3. Cambia el nomre de el archibo .env_example a .env y completa las variables:

   ```ini
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=task_manager
   ```

4. Crea la base de datos titulada _task_manager_:

   ```sql
   CREATE DATABASE task_manager;

   USE task_manager;

   CREATE TABLE user (
     user_id INT NOT NULL AUTO_INCREMENT,
     user_handle VARCHAR(50) NOT NULL UNIQUE,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     email_address VARCHAR(100) UNIQUE NOT NULL,
     user_password VARCHAR(50) NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
     PRIMARY KEY (user_id)
   );

   CREATE TABLE task (
     task_id INT NOT NULL AUTO_INCREMENT,
     task_title VARCHAR(100) NOT NULL,
     task_description VARCHAR(200) NOT NULL,
     task_content TEXT NOT NULL,
     is_completed BOOLEAN NOT NULL DEFAULT (FALSE),
     user_id INT,
     PRIMARY KEY (task_id),
     FOREIGN KEY (user_id) REFERENCES user(user_id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
   );
   ```
