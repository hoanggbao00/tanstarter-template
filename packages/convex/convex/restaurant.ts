import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const restaurantStatus = v.union(
  v.literal('available'),
  v.literal('closed'),
  v.literal('sold-out'),
  v.literal('hidden'),
);

const restaurantInsertFields = {
  name: v.string(),
  description: v.optional(v.string()),
  logo_url: v.optional(v.string()),
  banner_url: v.optional(v.string()),
  address: v.optional(v.string()),
  address_url: v.optional(v.string()),
  phone_number: v.optional(v.string()),
  email: v.optional(v.string()),
  social_urls: v.optional(v.array(v.string())),
  categories: v.optional(v.array(v.id('restaurant_categories'))),
  status: restaurantStatus,
} as const;

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as Partial<T>;
}

/**
 * Converts a restaurant name into a URL-safe slug:
 * - Normalise Unicode (NFD) to separate base chars from diacritics, then strip diacritics.
 * - Lowercase.
 * - Replace any run of non-alphanumeric characters with a single `-`.
 * - Trim leading/trailing `-`.
 */
function toBaseSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Generates a random lowercase alphanumeric suffix of the given length. */
function randomSuffix(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => await ctx.db.query('restaurants').order('desc').paginate(args.paginationOpts),
});

export const get = query({
  args: { id: v.id('restaurants') },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query('restaurants')
      .withIndex('slug', (q) => q.eq('slug', args.slug))
      .unique(),
});

export const create = mutation({
  args: restaurantInsertFields,
  handler: async (ctx, args) => {
    const baseSlug = toBaseSlug(args.name);

    // Ensure slug uniqueness: check index, append random suffix on collision.
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const existing = await ctx.db
        .query('restaurants')
        .withIndex('slug', (q) => q.eq('slug', slug))
        .first();
      if (!existing) {
        break;
      }
      slug = `${baseSlug}-${randomSuffix(5)}`;
      attempt++;
      if (attempt > 10) {
        // Extremely unlikely; use a longer suffix as a last resort.
        slug = `${baseSlug}-${randomSuffix(8)}`;
        break;
      }
    }

    return await ctx.db.insert('restaurants', { ...args, slug });
  },
});

export const update = mutation({
  args: {
    id: v.id('restaurants'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    banner_url: v.optional(v.string()),
    address: v.optional(v.string()),
    address_url: v.optional(v.string()),
    phone_number: v.optional(v.string()),
    email: v.optional(v.string()),
    social_urls: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.id('restaurant_categories'))),
    status: v.optional(restaurantStatus),
  },
  handler: async (ctx, args) => {
    // slug is intentionally excluded from args and must never be patched.
    const { id, ...rest } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error('Restaurant not found');
    }
    const patch = omitUndefined(rest);
    if (Object.keys(patch).length === 0) {
      return;
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id('restaurants') },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error('Restaurant not found');
    }
    await ctx.db.delete(args.id);
  },
});
