# DevChallenge 2: Login

## About

Login application that enables you access to an undefined space where can see all data associated to the logged account.

This system makes user can:

- Login/register in app using traditional form system.
- Login/register in app via an OAuth2 provider.
- See the data associated to the account.

By now, supported OAuth providers are:

- Google
- GitHub

This project was made using [Laravel](https://github.com/laravel/laravel).

## Prerequisites

- Install [Git](https://git-scm.com/downloads), the source control system.
- Install [PHP](https://www.php.net/downloads.php), set the command as an environment variable to be able execute PHP anywhere you are in CMD, you can follow this [guide](https://www.geeksforgeeks.org/how-to-execute-php-code-using-command-line/) from GeeksForGeeks.
- Install [Node.JS](https://nodejs.org/en), if you wanna know more check [official documentation](https://nodejs.org/docs/latest/api/).
- Install [NPM](https://www.npmjs.com/), for more information check [official documentation](https://docs.npmjs.com/).
- Install [Composer](https://getcomposer.org/), to know about it check [official documentation](https://getcomposer.org/doc/).

## How to use it

### 1. Download the repository

```bash
git clone https://github.com/Trane54/dev-challenge-2
```

### 2. Download and install dependencies

```bash
composer update
composer install
```

### 3. Create SQLite file

Create a file with the name `database.sqlite` in `/database` folder.

### 4. Execute migrations

```bash
php artisan migrate:refresh
```

### 5. Make a copy of .env.example file named .env

### 6. Put Oauth credentials 

In your `.env` file you will see the following properties:

```text
GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
GOOGLE_SECRET=YOUR-GOOGLE-SECRET

GITHUB_CLIENT_ID=YOUR-GITHUB-CLIENT-ID
GITHUB_SECRET=YOUR-GITHUB-SECRET
```

Replace the sample text with your Oauth credentials.

### 7. Test it

Run the lavarel server

```bash
php artisan serve
```

Access to `http://localhost:8000` and you will see the main page.

Now try to log in or register in application and you get it.

![Project main page screenshot](image.png)