<h1 align-text:"center">API Gestor académico de tareas</h1>


# 📘 Documentación

- **Nombre del proyecto:** API gestor académico de tareas 
- **Versión actual:** v1.0.0
- **Última actualización:** 23/10/2025  
- **Autores:** Leidy Alvarez, Maria Vargas, Andrea Mejía, Luna Salas, 

---

## ⚙️ Tecnologías utilizadas

- **NestJS** (Framework principal)
- **TypeScript**
- **MySQL** (Base de datos)
- **DBeaver** (Cliente de administración de BD)
- **Postman** (Pruebas de endpoints)
- **bcrypt** (Encriptación de contraseñas)
- **JWT** (Autenticación por tokens)

---

## Configuración del proyecto

```bash
$ npm install
```

## Compila y ejecuta el proyecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 📂 Estructura del proyecto

```
src/
 ├── common/
 │   ├── decorators
 │   │   └── roles.decorator.ts
 │   ├── enums
 │   │   └── roles.enum.ts
 │   ├── exceptions
 │   |   ├── auth
 |   |   |   ├── invalid-credentials.exception.ts
 |   |   |   ├── token-expired.exception.ts
 |   |   |   └── token-invalid.exception.ts
 │   |   ├── grades
 |   |   |   ├── duplicate-grade.exception.ts
 |   |   |   ├── grade-not-found.exception.ts
 |   |   |   ├── invalid-grade-value.exception.ts
 |   |   |   └── no-grade.exception.ts
 │   |   ├── tasks
 |   |   |   ├── invalid-task-deadline.exception.ts
 |   |   |   ├── task-already-exists.exception.ts
 |   |   |   ├── task-not-found.exception.ts
 |   |   |   └── unauthorized-task-access.exception.ts
 │   |   └── users
 |   |       ├── email-already-exists.exception.ts
 |   |       ├── unauthorized-role-action.exception.ts
 |   |       └── user-not-found.exception.ts
 │   ├── filters
 │   │   └── global-exception.filter.ts
 │   └── guards
 │       ├── jwt-guard.ts
 │       └── roles.guard.ts
 ├── dto/
 │   ├── create-grade.dto.ts
 │   ├── create-task.dto.ts
 │   ├── create-user.dto.ts
 │   ├── update-grade.dto.ts
 │   ├── update-task.dto.ts
 │   └── update-user.dto.ts
 ├── entities/
 │   ├── grade.entity.ts
 │   ├── task.entity.ts
 │   └── user.entity.ts
 ├── migrations/
 │   └── 1761426148341-InitMigration.ts
 ├── modules/
 |   ├── auth/
 │   |   ├── auth.controller.ts
 │   |   ├── auth.module.ts
 │   |   └── auth.service.ts
 |   ├── grades/
 │   |   ├── grades.controller.ts
 │   |   ├── grades.module.ts
 │   |   └── grades.service.ts
 │   ├── tasks/
 │   |   ├── tasks.controller.ts
 │   |   ├── tasks.module.ts
 │   |   └── tasks.service.ts
 |   └── users/
 │       ├── users.controller.ts
 │       ├── users.module.ts
 │       └── users.service.ts
 ├── app.controller.spec.ts
 ├── app.controller.ts
 ├── app.module.ts
 ├── app.service.ts
 └── main.ts
```

---

## 🚀 Endpoints principales

### 🔐 Autenticación
| Método | Ruta | Descripción | Requiere Token |
|--------|-------|--------------|----------------|
|  |  | Registra un nuevo usuario |  |
|  |  | Inicia sesión y devuelve token JWT |  |

---

### 👤 Usuarios
| Método | Ruta | Descripción | Requiere Token | Rol permitido |
|--------|-------|--------------|----------------|----------------|
| `GET` | `/users` | Obtiene todos los usuarios | ✅ |  |
| `GET` | `/users/:id` | Obtiene un usuario por ID | ✅ |  |

---

### 📝 Tareas
| Método | Ruta | Descripción | Requiere Token | Rol permitido |
|--------|-------|--------------|----------------|----------------|
|  |  |  |  |  |


---

### ✅ Calificaciones
| Método | Ruta | Descripción | Requiere Token | Rol permitido |
|--------|-------|--------------|----------------|----------------|
| `POST` | `/grades` | Crea una calificación | ✅ | Profesor |
| `PATCH` | `/grades/:id` | Actualiza una calificación | ✅ | Profesor |
| `GET` | `/grades/student/:studentId` | Muestra las notas de un estudiante | ✅ | Profesor |
| `GET` | `/grades/student/:studentId/average` | Devuelve el promedio de las notas | ✅ | Profesor - Estudiante |
| `DELETE` | `/grades/:id` | Elimina una calificación | ✅ | Profesor |

---

## 🔑 Autenticación

- Los endpoints protegidos requieren un **token JWT** en el header:  
  ```
  Authorization: Bearer <token>
  ```
- Los tokens se generan al iniciar sesión (`/auth/login`).  
- Las contraseñas se almacenan **encriptadas con bcrypt** antes de guardarse en la base de datos.

---

## ⚙️ Configuración del entorno

Archivo `.env`:
```
PORT = 4000
APP_NAME= ManagerUsers
DB_HOST= localhost
DB_PORT= 3306
DB_USERNAME= nombre_de_usuario
DB_PASSWORD= contraseña
DB_NAME= nombre_base_de_datos
JWT_SECRET_KEY= llave_secreta
JWT_EXPIRES_IN= tiempo_expiracion_token
```

---

📄 **Fin de la documentación**
