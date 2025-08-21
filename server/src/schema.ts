import { z } from 'zod';

// Enum schemas
export const clothingCategorySchema = z.enum([
  't-shirt',
  'hoodie',
  'pants',
  'trousers',
  'sweatshirt'
]);

export const clothingSizeSchema = z.enum([
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL'
]);

export const orderStatusSchema = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]);

export const paymentStatusSchema = z.enum([
  'pending',
  'completed',
  'failed',
  'refunded'
]);

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  password_hash: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: clothingCategorySchema,
  price: z.number().positive(),
  image_url: z.string().url(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Product = z.infer<typeof productSchema>;

// Product variant schema (for sizes and colors)
export const productVariantSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  size: clothingSizeSchema,
  color: z.string(),
  stock_quantity: z.number().int().nonnegative(),
  sku: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ProductVariant = z.infer<typeof productVariantSchema>;

// Cart schema
export const cartSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Cart = z.infer<typeof cartSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  id: z.number(),
  cart_id: z.number(),
  product_variant_id: z.number(),
  quantity: z.number().int().positive(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CartItem = z.infer<typeof cartItemSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  total_amount: z.number().positive(),
  status: orderStatusSchema,
  payment_status: paymentStatusSchema,
  shipping_address: z.string(),
  billing_address: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Order = z.infer<typeof orderSchema>;

// Order item schema
export const orderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  product_variant_id: z.number(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  created_at: z.coerce.date()
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Input schemas for creating entities
export const createUserInputSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  password: z.string().min(8)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createProductInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: clothingCategorySchema,
  price: z.number().positive(),
  image_url: z.string().url(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional()
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const createProductVariantInputSchema = z.object({
  product_id: z.number(),
  size: clothingSizeSchema,
  color: z.string().min(1),
  stock_quantity: z.number().int().nonnegative(),
  sku: z.string().min(1)
});

export type CreateProductVariantInput = z.infer<typeof createProductVariantInputSchema>;

export const addToCartInputSchema = z.object({
  user_id: z.number(),
  product_variant_id: z.number(),
  quantity: z.number().int().positive()
});

export type AddToCartInput = z.infer<typeof addToCartInputSchema>;

export const updateCartItemInputSchema = z.object({
  cart_item_id: z.number(),
  quantity: z.number().int().positive()
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemInputSchema>;

export const createOrderInputSchema = z.object({
  user_id: z.number(),
  shipping_address: z.string().min(1),
  billing_address: z.string().min(1),
  cart_items: z.array(z.object({
    product_variant_id: z.number(),
    quantity: z.number().int().positive()
  })).min(1)
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

// Input schemas for updating entities
export const updateProductInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: clothingCategorySchema.optional(),
  price: z.number().positive().optional(),
  image_url: z.string().url().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional()
});

export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

export const updateOrderStatusInputSchema = z.object({
  order_id: z.number(),
  status: orderStatusSchema
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;

// Query schemas
export const getProductsInputSchema = z.object({
  category: clothingCategorySchema.optional(),
  is_featured: z.boolean().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetProductsInput = z.infer<typeof getProductsInputSchema>;

export const getUserOrdersInputSchema = z.object({
  user_id: z.number(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});

export type GetUserOrdersInput = z.infer<typeof getUserOrdersInputSchema>;