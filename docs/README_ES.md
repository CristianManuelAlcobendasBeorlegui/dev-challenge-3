# DevChallenge 2: Sistema de inicio de sesión

## Sobre el proyecto

Aplicación de inicio de sesión que permite a los usuarios acceder a un espacio indefinido donde pueden ver los datos asociados a la cuenta.

Este sistema permite:

- Iniciar sesión/registrarse en la aplicación usando el sistema de formulario tradicional.
- Iniciar sesión/registrarse en la aplicación usando un proveedor OAuth.
- Ver los datos asociados a la cuenta.

Por ahora, los proveedores OAuth que están soportados son:

- Google
- GitHub

Este proyecto se ha desarrollado usando [Laravel](https://github.com/laravel/laravel).

## Primeros pasos

### 1. Descarga el proyecto

```bash
git clone https://github.com/Trane54/dev-challenge-2
```

### 2. Descarga e instala las dependencias

```bash
composer update
composer install
```

### 3. Crea el fichero SQLite

Crea un fichero `database.sqlite` en la carpeta `/database`.

### 4. Ejecuta las migraciones

```bash
php artisan migrate:refresh
```

### 5. Haz una copia del fichero .env.example llamada .env

### 6. Registra las credenciales de los proveedores OAuth

En el fichero `.env` encontrarás las siguientes propiedades:

```text
GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
GOOGLE_SECRET=YOUR-GOOGLE-SECRET

GITHUB_CLIENT_ID=YOUR-GITHUB-CLIENT-ID
GITHUB_SECRET=YOUR-GITHUB-SECRET
```

Remplaza el texto de ejemplo por tus propias credenciales OAuth.

### 7. Prueba

Ejecuta el servidor.

```bash
php artisan serve
```

Accede a `http://localhost:8000` y verás que aparecerás en la página principal.

Ahora, intenta iniciar sesión o registrarte en la aplicación.

![Project main page screenshot](../image.png)
