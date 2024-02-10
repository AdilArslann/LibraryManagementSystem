
# Library Management System

## Project Overview

This project is a Library Management System designed to facilitate the management of a school library's operations. It includes reservation feature for students with an account to reserve books to pick it up from the school library later. 


## Setup

1. `npm install`
2. Create a PostgreSQL database, or use an existing one from the previous exercises.
3. Setup `.env` files in `client` and `server` based on `.env.example` files.

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

### .env explanation

**Server**
```txt
NODE_ENV= The enviroment the app is running
DB_NAME= The name of your database
DB_USER= The name of the user to access the database
DB_PASSWORD= The password for the database
DB_PORT= The port which the database is running
DB_LOGGING= Can be set to either True or False to log the queries to the console
TOKEN_KEY= A key that is used for signing and verifying JWT token. 
GOOGLE_BOOKS_API_KEY= Books Api key from Google
```

**How to get your Books API key:**

[Go to Google cloud console](https://console.cloud.google.com/)

- Quick Access (APIs & Services)
- Library 
- Type Books API to the search bar
- Click on the API and Enable it
- Then create credentials and get your API key


## Running the server

In development mode:

```bash
# automatically restarts the server
npm run dev

# server can be started without a database
npm run dev:mem
```

### Experiment with the app with TRPC Panel
The project has implemented trpc panel which allows you to communicate with the routes and see all the routes that are available. 

You can use the panel by going into this page after you ran the server in development mode.
http://localhost:3000/panel

Example picture:
![image](https://github.com/TuringCollegeSubmissions/aarsla-BE.3.5/assets/82507565/d3b0233e-320a-40f1-b0f6-6fb525454047)

