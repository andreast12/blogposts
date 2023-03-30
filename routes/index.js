import express from "express";
import { ensureAuthenticated } from "../utils/authentication.js";

const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index", {
    pageTitle: "Blogposts App",
  });
});

export default router;
