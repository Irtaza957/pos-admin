import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" })
    .max(64, { message: "Password cannot exceed 64 characters" })
    .refine((password) => !/(password|qwerty)/i.test(password), {
      message: "Password contains a common pattern",
    }),
});

export const postCategorySchema = z.object({
  name: z.string().min(1, { message: "category name is required" }),
  description: z.string().min(10, { message: "Description is required atleast 10 character" }),
  image: z.string().optional(),
});

export const postSubCategorySchema = z.object({
  name: z.string().min(1, { message: "Subcategory name is required" }),
  description: z.string().min(10, { message: "Description is required atleast 10 character" }),
  // image: z.string().optional(),
  category_id: z.string().min(1, { message: "Cateory is Required" }),
});

export const postProductSchema = z.object({
  name: z.string().min(1, { message: "category name is required" }),

  price: z
    .string()
    .min(1, { message: "Price is required" })
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0, { message: "Price must be a valid positive number" }),
  restaurant_id: z.string().optional(),
  category_id: z.string().optional(),
  sub_category_id: z.string().optional(),
  // image: z.string().optional().optional(),
  active: z.boolean().optional(),
  quantity: z
    .string()
    .min(1, { message: "Price is required" })
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0, { message: "Price must be a valid positive number" }),
  tax_type: z.string().min(1, { message: "Tax Type is required" }),
  tax_amount: z
    .string()
    .min(1, { message: "Tax Amount is required" })
    .transform((value) => parseFloat(value))
    .refine((value) => !isNaN(value) && value > 0, { message: "Tax Amount must be a valid positive number" }),
  sku: z.string().optional(),
  unit: z.string().optional(),
  expiry_date: z.string().optional(),
});

export const postCustomerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^\d{8}$/, { message: "Phone number must be 8 digits" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
});

export const postBranchSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  mail: z.string().email({ message: "Invalid email address" }),
  location: z.string().min(1, { message: "Location is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  website: z.string().min(1, { message: "Website is required" }),
});

export const postEmployeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  job_title: z.string().min(1, { message: "Job Title is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  restaurant_id: z.string().min(1, { message: "Restaurant is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  mail: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
});
