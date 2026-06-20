import { z } from "zod";

export const createCustomerSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(10, "Phone number is too short"),
});