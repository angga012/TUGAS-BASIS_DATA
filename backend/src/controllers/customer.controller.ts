import { Request, Response, NextFunction } from "express";
import {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  registerCustomerTypeService,
} from "../services/customer.service";

import { success, error } from "../utils/response";

/* 
   GET ALL CUSTOMERS
*/
export async function getCustomers(
  req: Request,
  res: Response
) {
  try {
    const customers = await getAllCustomers();

    return success(
      res,
      "Customers fetched successfully",
      customers
    );
  } catch (err: any) {
    return error(res, err.message);
  }
}

/* =========================
   GET CUSTOMER BY ID
========================= */
export async function getCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const customer = await getCustomerById(id);

    if (!customer) {
      return error(res, "Customer not found", 404);
    }

    return success(
      res,
      "Customer fetched successfully",
      customer
    );
  } catch (err: any) {
    return error(res, err.message);
  }
}

/* =========================
   CREATE CUSTOMER
========================= */
export async function addCustomer(
  req: Request,
  res: Response
) {
  const {
    customer_name,
    email,
    address,
    phone_number,
  } = req.body;

  const customer = await createCustomer(
    customer_name,
    email,
    address,
    phone_number
  );

  return success(
    res,
    "Customer created successfully",
    customer,
    201
  );
}

/* =========================
   UPDATE CUSTOMER
========================= */
export async function editCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const {
      customer_name,
      email,
      address,
      phone_number,
    } = req.body;

    const updated = await updateCustomer(
      id,
      customer_name,
      email,
      address,
      phone_number
    );

    if (!updated) {
      return error(
        res,
        "Customer not found",
        404
      );
    }

    return success(
      res,
      "Customer updated successfully",
      updated
    );
  } catch (err: any) {
    return error(res, err.message);
  }
}

/* =========================
   DELETE CUSTOMER
========================= */
export async function removeCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const deleted = await deleteCustomer(id);

    if (!deleted) {
      return error(
        res,
        "Customer not found",
        404
      );
    }

    return success(
      res,
      "Customer deleted successfully",
      deleted
    );
  } catch (err: any) {
    return error(res, err.message);
  }
}

/* =========================
   REGISTER CUSTOMER TYPE
========================= */
export const registerCustomerType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result =
      await registerCustomerTypeService(req.body);

    return res.status(200).json({
      success: true,
      message:
        "Tipe data customer berhasil dikunci ke dalam database!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};