import express from "express";

import { validate } from "../middlewares/validate.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

import { createCustomerSchema } from "../validations/customer.validation";

import {
  addCustomer,
  getCustomers,
  getCustomer,
  editCustomer,
  removeCustomer,
  registerCustomerType,
} from "../controllers/customer.controller";

const router = express.Router();

/* =========================
   CREATE CUSTOMER
========================= */
router.post(
  "/",
  authenticateToken,
  authorizeRole("ADMIN"),
  validate(createCustomerSchema),
  addCustomer
);

/* =========================
   GET ALL CUSTOMERS
========================= */
router.get(
  "/",
  authenticateToken,
  getCustomers
);

/* =========================
   GET CUSTOMER BY ID
========================= */
router.get(
  "/:id",
  authenticateToken,
  getCustomer
);

/* =========================
   UPDATE CUSTOMER
========================= */
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  editCustomer
);

/* =========================
   DELETE CUSTOMER
========================= */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("ADMIN"),
  removeCustomer
);

/* =========================
   SET MEMBERSHIP TYPE
========================= */
router.post(
  "/set-type",
  authenticateToken,
  authorizeRole("ADMIN"),
  registerCustomerType
);

export default router;