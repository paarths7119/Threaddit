
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const createPost = async (req, res) => {
  const { title, body } = req.body;
  try {
    const post = await Post.create({ title, body, author: req.user._id });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .populate({ path: "comments", populate: { path: "author", select: "username" } })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate({ path: "comments", populate: { path: "author", select: "username" } });
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    if (post.upvotes.map(String).includes(userId)) {
      post.upvotes = post.upvotes.filter((u) => u.toString() !== userId);
    } else {
      post.upvotes.push(userId);
      post.downvotes = post.downvotes.filter((u) => u.toString() !== userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleDownvote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();
    if (post.downvotes.map(String).includes(userId)) {
      post.downvotes = post.downvotes.filter((u) => u.toString() !== userId);
    } else {
      post.downvotes.push(userId);
      post.upvotes = post.upvotes.filter((u) => u.toString() !== userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = await Comment.create({ text, author: req.user._id, post: req.params.id });
    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();
    const populated = await comment.populate("author", "username");
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
