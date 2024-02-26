# Library Management System

## Project Overview

This project is a Library Management System designed to facilitate the management of a school library's operations. It includes reservation feature for students with an account to reserve books to pick it up from the school library later.

## Setup

1. `npm install`
2. Create a PostgreSQL database.
3. Setup `.env` files in `client` and `server` based on `.env.example` files.
4. Can be started using `docker compose up`

## Tests

```bash
# front end unit and E2E tests
npm test -w client

# front end unit tests
npm run test:unit -w client

# front end E2E tests
npm run test:e2e -w client

# back end tests with an in-memory database
npm test -w server

# back end tests with a development database
npm run test:db -w server
```

## Running the server

I highly recommend running:

```bash
npm run seed
```

To create a initial school and admin user to test out the system, unless you wanna create them manually using sql.

Credentials of the admin user:

```
Email: admin@gmail.com
password: Password.123!
```

After logging in as the admin user you can create a new school and Librarian for that school and then test out the user flow. Creating books, managing reservations, and managing loans.

In development mode:

```bash
# automatically restarts the server
npm run dev

# server can be started without a database
npm run dev:mem
```

## Running the Client

Running the client is rather straight forward, you need to add the necessary values to the .env file and run the server side.

Running the client side in development mode:

```bash
npm run dev
```
