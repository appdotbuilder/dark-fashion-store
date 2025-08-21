import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createUserInputSchema,
  createProductInputSchema,
  createProductVariantInputSchema,
  addToCartInputSchema,
  updateCartItemInputSchema,
  createOrderInputSchema,
  getProductsInputSchema,
  getUserOrdersInputSchema,
  updateOrderStatusInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getProducts } from './handlers/get_products';
import { getProductById } from './handlers/get_product_by_id';
import { createProduct } from './handlers/create_product';
import { createProductVariant } from './handlers/create_product_variant';
import { addToCart } from './handlers/add_to_cart';
import { getCart } from './handlers/get_cart';
import { updateCartItem } from './handlers/update_cart_item';
import { removeFromCart } from './handlers/remove_from_cart';
import { createOrder } from './handlers/create_order';
import { getUserOrders } from './handlers/get_user_orders';
import { getOrderById } from './handlers/get_order_by_id';
import { updateOrderStatus } from './handlers/update_order_status';
import { getFeaturedProducts } from './handlers/get_featured_products';
import { searchProducts } from './handlers/search_products';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  // Product management
  getProducts: publicProcedure
    .input(getProductsInputSchema)
    .query(({ input }) => getProducts(input)),

  getProductById: publicProcedure
    .input(z.number())
    .query(({ input }) => getProductById(input)),

  createProduct: publicProcedure
    .input(createProductInputSchema)
    .mutation(({ input }) => createProduct(input)),

  createProductVariant: publicProcedure
    .input(createProductVariantInputSchema)
    .mutation(({ input }) => createProductVariant(input)),

  getFeaturedProducts: publicProcedure
    .input(z.number().optional())
    .query(({ input }) => getFeaturedProducts(input)),

  searchProducts: publicProcedure
    .input(z.object({
      query: z.string(),
      limit: z.number().optional()
    }))
    .query(({ input }) => searchProducts(input.query, input.limit)),

  // Shopping cart management
  addToCart: publicProcedure
    .input(addToCartInputSchema)
    .mutation(({ input }) => addToCart(input)),

  getCart: publicProcedure
    .input(z.number())
    .query(({ input }) => getCart(input)),

  updateCartItem: publicProcedure
    .input(updateCartItemInputSchema)
    .mutation(({ input }) => updateCartItem(input)),

  removeFromCart: publicProcedure
    .input(z.number())
    .mutation(({ input }) => removeFromCart(input)),

  // Order management
  createOrder: publicProcedure
    .input(createOrderInputSchema)
    .mutation(({ input }) => createOrder(input)),

  getUserOrders: publicProcedure
    .input(getUserOrdersInputSchema)
    .query(({ input }) => getUserOrders(input)),

  getOrderById: publicProcedure
    .input(z.object({
      orderId: z.number(),
      userId: z.number()
    }))
    .query(({ input }) => getOrderById(input.orderId, input.userId)),

  updateOrderStatus: publicProcedure
    .input(updateOrderStatusInputSchema)
    .mutation(({ input }) => updateOrderStatus(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();