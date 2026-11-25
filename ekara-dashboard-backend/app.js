var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const {
    startPaymentReminderScheduler,
} = require("./src/jobs/paymentReminderScheduler.job");
const { connectDatabase } = require("./src/database/config/db");

var indexRouter = require("./src/routes/index");

const requestLogger = require("./src/middleware/requestLogger");
const notFound = require("./src/middleware/notFound");
const errorHandler = require("./src/middleware/errorHandler");

connectDatabase();

var app = express();


const allowedOrigins = [
  "http://localhost:3000",
  "https://helloekara.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(requestLogger);

app.use("/api/v1", indexRouter);

startPaymentReminderScheduler();
app.use(notFound);

app.use(errorHandler);

module.exports = app;