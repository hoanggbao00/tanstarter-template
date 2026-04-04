import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const menuItemStatus = v.union(
  v.literal('available'),
  v.literal('sold-out'),
  v.literal('discontinued'),
  v.literal('hidden'),
);

export const listByRestaurant = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('menu_items')
      .withIndex('by_restaurant', (q) => q.eq('restaurant_id', args.restaurantId))
      .collect();
    return items.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const listCategoriesByRestaurant = query({
  args: { restaurantId: v.id('restaurants') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('menu_items')
      .withIndex('by_restaurant', (q) => q.eq('restaurant_id', args.restaurantId))
      .collect();

    const categories = new Set<string>();
    for (const item of items) {
      const c = item.category?.trim();
      if (c) {
        categories.add(c);
      }
    }

    return Array.from(categories).sort((a, b) => a.localeCompare(b));
  },
});

export const update = mutation({
  args: {
    id: v.id('menu_items'),
    restaurantId: v.id('restaurants'),
    name: v.string(),
    description: v.optional(v.string()),
    image_url: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.number(),
    is_topping: v.boolean(),
    status: menuItemStatus,
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) {
      throw new Error('Không tìm thấy món');
    }
    if (doc.restaurant_id !== args.restaurantId) {
      throw new Error('Không có quyền cập nhật món này');
    }

    const name = args.name.trim();
    if (!name) {
      throw new Error('Tên món không được để trống');
    }
    if (!Number.isFinite(args.price) || args.price < 0) {
      throw new Error('Giá không hợp lệ');
    }

    await ctx.db.replace(args.id, {
      ...doc,
      name,
      description: args.description?.trim() || undefined,
      image_url: args.image_url?.trim() || undefined,
      category: args.category?.trim() || undefined,
      price: args.price,
      is_topping: args.is_topping,
      status: args.status,
    });
  },
});
