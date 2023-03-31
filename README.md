# ♟︎ Boardgames API ♟︎

## Hosted Version

Hosted with ElephentPSQL and Render at:
https://board-games-api-q1cq.onrender.com/api

## Project Summary

This is an API to manage board game review information. Information about reviews, categories, users, and review comments can be retrieved and stored for a hypothetical board game review website.

## Dependencies

### Platforms:

- Developed on [**Ubuntu**](https://ubuntu.com/): v22.10, intended to be ran on **Linux** or **MacOS**
- [**Node**](https://nodejs.org/en): v19.7.0
- [**PSQL**](https://www.postgresql.org/): v14.7.0

### Dependencies:

    dotenv: ^16.0.0
    express: ^4.18.2
    pg: ^8.7.3
    pg-format: ^1.0.4

### Development Dependencies:

    husky: ^8.0.2
    jest: ^27.5.1
    jest-extended: ^2.0.0
    jest-sorted: ^1.0.14
    supertest: ^6.3.3

## Environment Variables

Our environment variables are stored in .env files not included in this GIT repository. In order to use this project you need to create these files. `.env.development` and `.env.test` will inform the program what our test and development databases are called. If hosting this remotely you should also create `.env.production`, this file will tell the program where the remotely hosted database is. These files belong in the **root** directory of our project.

`.env.test` should contain:

```javascript
PGDATABASE = nc_games_test;
```

`.env.development` should contain:

```javascript
PGDATABASE = nc_games;
```

Optionally `.env.production` should contain:

```javascript
DATABASE_URL=<your database url>
```

## Step-by-step setup

1. Install [**Node.js**](https://nodejs.org/en) (minimum version: v19.7.0).
2. Install [**PSQL**](https://www.postgresql.org/) (minimum version: v14.7.0).
3. If your operating system did not come with Git, install it from [**here**](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
4. In the terminal, navigate to where you'd like to save this project. If you're not sure how to go about this check out [**here**](https://help.ubuntu.com/community/UsingTheTerminal)
5. Using `git clone https://github.com/quinnl404/board-games-api.git` we can download this project to our current directory. _Note: git clone creates a new folder, it does not dump all the files individually into whatever directory you're in._
6. Navigate into the newly created folder with `cd board-games-api/`.
7. Use `npm install` to install all Node packages that this project depends on.
8. Create the `.env` files as described earlier.
9. Run `npm run setup-dbs` to create the needed databases in PSQL.
10. Run `npm run seed` to create all the tables and populate the development database, if interested in running tests, `npm test` will seed the test database each time for you.
11. Run `npm start` to start listening for requests!
12. Navigate to `localhost:9090/api` in your browser or any HTTP client like [**Insomnia**](https://insomnia.rest/download) to see the various endpoints.
