import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { ensureAuthenticated } from "../utils/authentication.js";

const router = express.Router();

router.get("/view/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("Invalid ID");
  } else {
    const post = await Post.findById(req.params.id).populate("user").lean();
    if (!post) {
      res.status(404).send("404 Not Found");
    } else {
      res.render("posts/view", {
        pageTitle: post.title,
        post,
        loggedInUser: req.user,
        successMsg: req.flash("successMsg"),
      });
    }
  }
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("posts/add", {
    pageTitle: "New post",
  });
});

router.post("/add", ensureAuthenticated, async (req, res) => {
  const { title, body } = req.body;
  await Post.create({
    title,
    body,
    createdAt: new Date(),
    user: req.user.id,
  });
  req.flash("successMsg", "Your post has been created");
  res.redirect("/");
});

router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send("Invalid ID");
  } else {
    const post = await Post.findById(req.params.id).populate("user").lean();
    if (!post) {
      res.status(404).send("404 Not Found");
    } else if (post.user._id.toString() !== req.user.id) {
      res.status(403).send("403 Forbidden");
    } else {
      res.render("posts/edit", {
        pageTitle: "Edit post",
        post,
        loggedInUser: req.user,
      });
    }
  }
});

router.put("/edit/:id", ensureAuthenticated, async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.findById(req.params.id);
  post.title = title;
  post.body = body;
  await post.save();
  req.flash("successMsg", "Your changes have been saved");
  res.redirect(`/posts/view/${req.params.id}`);
});

router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
  await Post.deleteOne({ _id: req.params.id });
  req.flash("successMsg", "Your post has been deleted");
  res.redirect("/");
});

export default router;
