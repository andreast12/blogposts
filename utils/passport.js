import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.js";

function initPassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        let error = false;
        if (!user) error = true;
        else {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) error = true;
        }

        if (error)
          return done(null, false, { message: "Email or password incorrect" });
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
}

export default initPassport;
