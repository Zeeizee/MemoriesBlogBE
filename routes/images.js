import express from "express";
import { handleUpload } from "../middleware/upload.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  uploadImage,
  getAllImages,
  getOneImageById,
  updateOneImageById,
  deleteOneImageById,
} from "../controllers/image.controller.js";

const router = express.Router();

router.get("/", getAllImages);
router.get("/:id", getOneImageById);
router.post("/", requireAuth, handleUpload("image"), uploadImage);
router.put("/:id", requireAuth, handleUpload("image"), updateOneImageById);
router.delete("/:id", requireAuth, deleteOneImageById);

export default router;