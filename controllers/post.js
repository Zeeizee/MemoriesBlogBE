import mongoose from "mongoose";
import PostModel from "../modals/post.js";
import {
  normalizePostBody,
  validatePostBody,
} from "../utils/postHelpers.js";
import { BLOG_CATEGORIES } from "../constants/categories.js";
import { parsePagination, buildPageMeta } from "../utils/pagination.js";

export const getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const { page, limit, skip } = parsePagination(req.query, {
      defaultLimit: 7,
      maxLimit: 20,
    });
    const filter = {};

    if (category) {
      if (!BLOG_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      filter.category = category;
    }

    const [posts, total] = await Promise.all([
      PostModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PostModel.countDocuments(filter),
    ]);

    res.status(200).json({
      posts,
      pagination: buildPageMeta({ page, limit, total }),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createNewPosts = async (req, res) => {
  try {
    const postBody = normalizePostBody(req.body);
    const errors = validatePostBody(postBody);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const newPost = new PostModel(postBody);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const delPosts = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const deleted = await PostModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ status: 200, message: "Post deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePosts = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postBody = normalizePostBody(req.body);
    const errors = validatePostBody(postBody);
    if (errors.length) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(_id, postBody, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const likePosts = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      _id,
      { $inc: { likeCount: 1 } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
