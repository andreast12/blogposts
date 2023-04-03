import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("user")
    .sort({ createdAt: "desc" })
    .lean();

  res.render("index", {
    pageTitle: "Blogposts",
    posts,
    loggedInUser: req.user,
    successMsg: req.flash("successMsg"),
  });
});

export default router;
