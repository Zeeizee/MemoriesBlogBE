import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/streamUpload.js";
import { decodePublicId } from "../utils/cloudinaryHelpers.js";
import { parseCursorLimit } from "../utils/pagination.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(201).json({
      id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOneImageById = async (req, res) => {
  try {
    const publicId = decodePublicId(req.params.id);
    const result = await cloudinary.api.resource(publicId);
    res.status(200).json({
      id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    res.status(404).json({ message: "Image not found" });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const { limit, cursor } = parseCursorLimit(req.query, {
      defaultLimit: 12,
      maxLimit: 50,
    });

    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "images/",
      max_results: limit,
      ...(cursor && { next_cursor: cursor }),
    });

    const images = result.resources.map((img) => ({
      id: img.public_id,
      url: img.secure_url,
    }));

    res.status(200).json({
      images,
      pagination: {
        limit,
        nextCursor: result.next_cursor || null,
        hasMore: Boolean(result.next_cursor),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOneImageById = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const publicId = decodePublicId(req.params.id);
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64, {
      public_id: publicId,
      overwrite: true,
    });

    res.status(200).json({
      id: result.public_id,
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOneImageById = async (req, res) => {
  try {
    const publicId = decodePublicId(req.params.id);
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== "ok" && result.result !== "not found") {
      return res.status(400).json({ message: "Failed to delete image" });
    }
    res.status(200).json({ message: "Image deleted", id: publicId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
