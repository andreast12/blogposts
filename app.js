import "dotenv/config";
import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import mongoURI from "./utils/db.js";
import usersRouter from "./routes/users.js";
import indexRouter from "./routes/index.js";
import initPassport from "./utils/passport.js";

const PORT = process.env.PORT || 5000;
const app = express();

// handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// for parsing form input
app.use(express.urlencoded({ extended: true }));

// express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// mongoose
try {
  await mongoose.connect(mongoURI);
} catch (err) {
  console.log(err);
}

// routers
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(PORT);
