import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  restaurant_categories: defineTable({
    name: v.string(),
    image_url: v.optional(v.string()),
  }),
  restaurants: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    banner_url: v.optional(v.string()),
    address: v.optional(v.string()),
    address_url: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    email: v.optional(v.string()),
    social_urls: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.id('restaurant_categories'))),
    status: v.union(v.literal('available'), v.literal('closed'), v.literal('sold-out'), v.literal('hidden')), // available, closed, sold-out, hidden
  }).index('slug', ['slug']),
  menu_items: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    image_url: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.number(),
    restaurant_id: v.id('restaurants'),
    toppings: v.optional(v.array(v.id('menu_items'))),
    is_topping: v.boolean(), // if true, this will not show at main menu but will show as a topping for other menu items
    status: v.union(v.literal('available'), v.literal('sold-out'), v.literal('discontinued'), v.literal('hidden')),
  }).index('by_restaurant', ['restaurant_id']),
});
