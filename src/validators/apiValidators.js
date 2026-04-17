import { z } from "zod";

// --- REUSABLE SCHEMAS ---
const ImageSchema = z.string().url().or(z.string()); // Handles full URLs or paths

// --- USER & AUTH ---
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10).optional().nullable(),
  profilePic: z.string().optional(),
});

export const dashboardStatsSchema = z.object({
  totalOrders: z.number().default(0),
  pendingOrders: z.number().default(0),
  totalSpent: z.number().default(0),
});

// --- SHOP (Brands, Categories, Banners) ---
export const brandSchema = z.object({
  _id: z.string(),
  name: z.string(),
  image: ImageSchema.optional(),
});

export const categorySchema = z.object({
  _id: z.string(),
  title: z.string(),
  icon: ImageSchema.optional(),
});

export const bannerSchema = z.object({
  _id: z.string(),
  title: z.string().optional(),
  image: ImageSchema,
  link: z.string().optional(),
});

// --- PRODUCTS ---
export const productSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Product name required"),
  price: z.number().nonnegative(),
  discountPrice: z.number().optional(),
  images: z.array(z.string()).default([]),
  brand: z.union([z.string(), brandSchema]).optional(),
  category: z.union([z.string(), categorySchema]).optional(),
  stock: z.number().default(0),
  description: z.string().optional(),
});

// Paginated Product Response
export const paginatedProductsSchema = z.object({
  products: z.array(productSchema),
  currentPage: z.number().default(1),
  totalPages: z.number().default(1),
  totalProducts: z.number().default(0),
});

// --- CART & ADDRESS ---
export const cartItemSchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  quantity: z.number().int().min(1),
  price: z.number(),
  name: z.string().optional(),
  image: z.string().optional(),
});

export const addressSchema = z.object({
  _id: z.string().optional(),
  label: z.enum(["Home", "Work", "Other"]).default("Home"),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(5),
  isDefault: z.boolean().default(false),
});

// --- ORDERS ---
export const orderItemSchema = z.object({
  product: z.union([z.string(), productSchema]),
  quantity: z.number(),
  price: z.number(),
});

export const orderDetailsSchema = z.object({
  _id: z.string(),
  orderId: z.string(),
  items: z.array(orderItemSchema),
  totalAmount: z.number(),
  status: z.enum(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Returned"]),
  createdAt: z.string(),
  paymentStatus: z.string(),
});

// --- REVIEWS/RATINGS ---
export const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  userName: z.string().optional(),
  createdAt: z.string().optional(),
});