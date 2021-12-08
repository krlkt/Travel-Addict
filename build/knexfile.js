"use strict";
// module.exports = {
//   development: {
//     client: 'postgresql',
//     connection: 'postgresql://localhost:5432/',
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: __dirname + '/db/migrations',
//     },
//     seeds: {
//       directory: __dirname + '/db/seeds',
//     },
//   },
//   production: {
//     client: 'postgresql',
//     connection: process.env.DATABASE_URL,
//     migrations: {
//       directory: __dirname + '/db/migrations',
//     },
//     seeds: {
//       directory: __dirname + '/db/seeds/production',
//     },
//   },
// };
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false } // allow self-signed certificate for Heroku/AWS
            : false, // if we run locally, we don't want SSL at all
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        //    tableName: "knex_migrations",
        directory: __dirname + '/db/migrations',
    },
    seeds: {
        directory: __dirname + '/db/seeds',
    },
};
exports.default = config;
