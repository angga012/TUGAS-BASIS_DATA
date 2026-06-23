import { Request, Response } from "express";
import {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "../services/field.service";

/*
   GET FIELDS
*/
export async function getFields(req: Request, res: Response) {
  try {
    const id = req.params.id ? Number(req.params.id) : null;

    if (id) {
      const field = await getFieldById(id);
      if (!field) {
        return res.status(404).json({ success: false, message: "Field not found" });
      }
      return res.status(200).json({ success: true, message: "Field fetched successfully", data: field });
    }

    const fields = await getAllFields();
    return res.status(200).json({ success: true, message: "All fields fetched successfully", data: fields });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* =========================
   CREATE FIELDD
========================= */
export async function addField(req: Request, res: Response) {
  try {
    const { field_name, price_per_hour, capacity, field_type, status } = req.body;

    // Langsung tembak service tanpa validasi berbelit-belit
    const field = await createField(
      field_name,
      Number(price_per_hour),
      Number(capacity),
      field_type,
      status || "Available"
    );

    return res.status(201).json({ success: true, message: "Field created successfully", data: field });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* =========================
   EDIT FIELD
========================= */
export async function editField(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { field_name, price_per_hour, capacity, field_type, status } = req.body;

    const updated = await updateField(
      id,
      field_name,
      Number(price_per_hour),
      Number(capacity),
      field_type,
      status
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Field not found" });
    }

    return res.status(200).json({ success: true, message: "Field updated successfully", data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* =========================
   HAPUS FIELD
========================= */
export async function removeField(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteField(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Field not found" });
    }

    return res.status(200).json({ success: true, message: "Field deleted successfully", data: deleted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}