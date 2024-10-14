# DevChallenge 2: Login

<details>
  <summary><b>Table of contents</b></summary>

- [DevChallenge 2: Login](#devchallenge-2-login)
  - [About](#about)
  - [Prerequisites](#prerequisites)
  - [How to use it](#how-to-use-it)
    - [1. Download the repository](#1-download-the-repository)
    - [2. Download and install dependencies](#2-download-and-install-dependencies)
    - [3. Make a copy of file ".env.example" named ".env"](#3-make-a-copy-of-file-envexample-named-env)
    - [4. Create SQLite file](#4-create-sqlite-file)
    - [5. Execute migrations](#5-execute-migrations)
    - [6. Enter your own OAuth credentials](#6-enter-your-own-oauth-credentials)
    - [7. Test it](#7-test-it)
  - [Common errors](#common-errors)
    - [1. Illuminate\\Encryption\\MissingAppKeyException: No application encryption key has been specified.](#1-illuminateencryptionmissingappkeyexception-no-application-encryption-key-has-been-specified)

</details>

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
cd dev-challenge-2
```

### 2. Download and install dependencies

```bash
composer update
composer install
```

### 3. Make a copy of file ".env.example" named ".env"

Press Control+C to `.env.example` file, Control+V, rename de new file to `.env` 😃

### 4. Create SQLite file

If you want to use the default configuration, you will need to create a file named `database.sqlite` in `/database` folder where will store all application data.

### 5. Execute migrations

```bash
php artisan migrate:refresh
```

### 6. Enter your own OAuth credentials

In your `.env` file you will see the following properties:

```text
GOOGLE_CLIENT_ID=YOUR-GOOGLE-CLIENT-ID
GOOGLE_SECRET=YOUR-GOOGLE-SECRET

GITHUB_CLIENT_ID=YOUR-GITHUB-CLIENT-ID
GITHUB_SECRET=YOUR-GITHUB-SECRET
```

Replace the sample text with your Oauth credentials.

### 7. Test it

Open two CMDs. In first CMD start NPM developer server.

```bash
npm install
npm run dev
```

Now, on the second CMD, start your PHP server.

```bash
php artisan serve
```

Once your server gets started, try to access [http://localhost:8000](http://localhost:8000), you will see the main page.

![Project main page screenshot](image.png)

Try to register an account or login via an OAuth provider.

![Login page screenshot](image-1.png)

## Common errors

### 1. Illuminate\Encryption\MissingAppKeyException: No application encryption key has been specified.

When you download a Laravel project for first time, you need to generate an encryption key.

You can generate it using the following command:

```bash
php artisan key:generate
```
