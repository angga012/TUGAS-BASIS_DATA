import express from "express";
import {
  addField,
  getFields,
  editField,
  removeField,
} from "../controllers/field.controller";

const router = express.Router();

/* =========================
    ROUTES FIELD (POLOSAN)
========================= */
router.post("/", addField);         // Create
router.get("/", getFields);         // Read All
router.get("/:id", getFields);     // Read Detail
router.put("/:id", editField);      // Update
router.delete("/:id", removeField);   // Delete

export default router;