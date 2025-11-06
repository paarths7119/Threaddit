
import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createPost,
  getPosts,
  getPost,
  toggleUpvote,
  toggleDownvote,
  addComment,
} from "../controllers/postsController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.get("/:id", getPost);
router.post("/:id/upvote", protect, toggleUpvote);
router.post("/:id/downvote", protect, toggleDownvote);
router.post("/:id/comments", protect, addComment);

export default router;
