import "dotenv/config";
import express from "express";
import { create } from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import methodOverride from "method-override";
import mongoURI from "./utils/db.js";
import usersRouter from "./routes/users.js";
import indexRouter from "./routes/index.js";
import postsRouter from "./routes/posts.js";
import initPassport from "./utils/passport.js";
import { DateTime } from "luxon";

const PORT = process.env.PORT || 5000;
const app = express();

// handlebars
const hbs = create({
  helpers: {
    renderEditDeleteIcon(postOwner, loggedInUser, postId) {
      if (loggedInUser && postOwner._id.toString() === loggedInUser.id) {
        return `<div class="d-flex column-gap-3 mt-5">
          <a href="/posts/edit/${postId}" class="btn btn-primary"><i class="bi bi-pencil-square me-1"></i>Edit</a>
          <form action="/posts/delete/${postId}?_method=delete" method="post">
            <button type="submit" class="btn btn-danger">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </form>
        </div>`;
      }
      return "";
    },
    relativeDate(date) {
      return DateTime.fromJSDate(date).toRelative();
    },
    absoluteDate(date) {
      return DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED);
    },
    addOne(num) {
      return num + 1;
    },
  },
});
app.engine("handlebars", hbs.engine);
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

// method-override
app.use(methodOverride("_method"));

// mongoose
try {
  await mongoose.connect(mongoURI);
} catch (err) {
  console.log(err);
}

// routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.listen(PORT);
