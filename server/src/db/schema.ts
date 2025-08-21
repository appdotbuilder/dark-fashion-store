import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const clothingCategoryEnum = pgEnum('clothing_category', [
  't-shirt',
  'hoodie',
  'pants',
  'trousers',
  'sweatshirt'
]);

export const clothingSizeEnum = pgEnum('clothing_size', [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL'
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded'
]);

// Tables
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: clothingCategoryEnum('category').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image_url: text('image_url').notNull(),
  is_featured: boolean('is_featured').default(false).notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariantsTable = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').references(() => productsTable.id).notNull(),
  size: clothingSizeEnum('size').notNull(),
  color: text('color').notNull(),
  stock_quantity: integer('stock_quantity').default(0).notNull(),
  sku: text('sku').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const cartsTable = pgTable('carts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const cartItemsTable = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cart_id: integer('cart_id').references(() => cartsTable.id).notNull(),
  product_variant_id: integer('product_variant_id').references(() => productVariantsTable.id).notNull(),
  quantity: integer('quantity').default(1).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const ordersTable = pgTable('orders', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => usersTable.id).notNull(),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  payment_status: paymentStatusEnum('payment_status').default('pending').notNull(),
  shipping_address: text('shipping_address').notNull(),
  billing_address: text('billing_address').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItemsTable = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').references(() => ordersTable.id).notNull(),
  product_variant_id: integer('product_variant_id').references(() => productVariantsTable.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  carts: many(cartsTable),
  orders: many(ordersTable),
}));

export const productsRelations = relations(productsTable, ({ many }) => ({
  variants: many(productVariantsTable),
}));

export const productVariantsRelations = relations(productVariantsTable, ({ one, many }) => ({
  product: one(productsTable, {
    fields: [productVariantsTable.product_id],
    references: [productsTable.id],
  }),
  cartItems: many(cartItemsTable),
  orderItems: many(orderItemsTable),
}));

export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [cartsTable.user_id],
    references: [usersTable.id],
  }),
  items: many(cartItemsTable),
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartsTable, {
    fields: [cartItemsTable.cart_id],
    references: [cartsTable.id],
  }),
  productVariant: one(productVariantsTable, {
    fields: [cartItemsTable.product_variant_id],
    references: [productVariantsTable.id],
  }),
}));

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.user_id],
    references: [usersTable.id],
  }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.order_id],
    references: [ordersTable.id],
  }),
  productVariant: one(productVariantsTable, {
    fields: [orderItemsTable.product_variant_id],
    references: [productVariantsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;

export type ProductVariant = typeof productVariantsTable.$inferSelect;
export type NewProductVariant = typeof productVariantsTable.$inferInsert;

export type Cart = typeof cartsTable.$inferSelect;
export type NewCart = typeof cartsTable.$inferInsert;

export type CartItem = typeof cartItemsTable.$inferSelect;
export type NewCartItem = typeof cartItemsTable.$inferInsert;

export type Order = typeof ordersTable.$inferSelect;
export type NewOrder = typeof ordersTable.$inferInsert;

export type OrderItem = typeof orderItemsTable.$inferSelect;
export type NewOrderItem = typeof orderItemsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  users: usersTable,
  products: productsTable,
  productVariants: productVariantsTable,
  carts: cartsTable,
  cartItems: cartItemsTable,
  orders: ordersTable,
  orderItems: orderItemsTable,
};