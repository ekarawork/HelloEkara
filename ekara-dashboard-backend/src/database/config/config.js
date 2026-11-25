
const dotenv = require("dotenv");
const path = require("path");

const env = process.env.NODE_ENV || "local";

// Load local/development env files.
// Hostinger production variables are injected by the hosting platform.
if (env !== "production") {
  let envFile = ".env";

  if (env === "development") {
    envFile = ".env.development";
  }

  dotenv.config({
    path: path.resolve(process.cwd(), envFile),
    override: false,
  });
}

console.log("Environment:", env);
console.log("DB Host:", process.env.DB_HOST);
console.log("DB Port:", process.env.DB_PORT);
console.log("DB Name:", process.env.DB_NAME);
console.log("DB User:", process.env.DB_USER);
console.log("DB Password:", process.env.DB_PASSWORD ? "SET" : "NOT SET");

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    dialectOptions:
      process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    logging: false,
  },

  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
};
