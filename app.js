require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
var session = require("express-session");
const passport = require("passport");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var fileupload = require("express-fileupload");

var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');
let authRouter = require("./routes/API/auth");
let bookRouter = require("./routes/API/bookRoute");
let userRouter = require("./routes/API/userRoute");

var app = express();
let cors = require("cors");
const mongoose = require("mongoose");
const { compare } = require("bcrypt");

const chatId = 5265243832;

let api_enabled = true

// MongoDB setup Here

const ConnectWithRetry = () => {
  mongoose
    .connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
    .then(() => {
      const res = "Connected Successfully";
      // bot.sendMessage(chatId, res);
      console.log(res);
    })
    .catch((error) => {
      const res = "Failed to Connect Retrying";
      console.log(res);
      // bot.sendMessage(chatId, res);

      setTimeout(ConnectWithRetry, 5000);
    });
};

ConnectWithRetry();

app.use(
  cors({
    origin: "*",
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express Session codes here
app.use(
  session({
    secret: "hello_world",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


if(api_enabled==true){
app.use("/", indexRouter);
app.use("/apiV3/auth", authRouter);

}
app.use("/apiV3/books", bookRouter);
app.use('/apiV3/users',userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
