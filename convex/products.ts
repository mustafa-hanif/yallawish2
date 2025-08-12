import { Doc, Id } from "@/convex/_generated/dataModel";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const get = query({
  args: { keyword: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const keyword = args.keyword ?? "";
    return await ctx.db
      .query("products")
      .withIndex("by_keyword", (q) => q.eq("keyword", keyword))
      .collect();
  },
});

type FeaturedProduct = Doc<"products">;
export const storeProducts = internalMutation({
  args: { product: v.any() },
  handler: async (ctx, args) => {
    console.log("Storing product:", args.product);
    const _product = args.product as FeaturedProduct;
    await ctx.db.insert("products", {
      name: _product.name,
      description: _product.description,
      price: _product.price,
      image_url: _product.image_url,
      rating: _product.rating,
      category: _product.category,
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
      id: _product.id,
      user_id: _product.user_id,
      status: _product.status,
      in_stock: true,
      keyword: _product.keyword,
      review_count: _product.review_count,
      source_url: _product.source_url,
      source_type: _product.source_type,
    });
    return "Product stored successfully";
  },
});

// Lists
export const createList = mutation({
  args: {
    title: v.string(),
    note: v.optional(v.union(v.string(), v.null())),
    eventDate: v.optional(v.union(v.string(), v.null())),
    shippingAddress: v.optional(v.union(v.string(), v.null())),
    occasion: v.optional(v.union(v.string(), v.null())),
    coverPhotoUri: v.optional(v.union(v.string(), v.null())),
    privacy: v.union(v.literal("private"), v.literal("shared")),
    user_id: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("lists", {
      user_id: args.user_id ?? null,
      title: args.title,
      note: args.note ?? null,
      eventDate: args.eventDate ?? null,
      shippingAddress: args.shippingAddress ?? null,
      occasion: args.occasion ?? null,
      coverPhotoUri: args.coverPhotoUri ?? null,
      privacy: args.privacy,
      created_at: now,
      updated_at: now,
    });
    return id;
  },
});

export const updateListDetails = mutation({
  args: {
    listId: v.id("lists"),
    title: v.string(),
    note: v.optional(v.union(v.string(), v.null())),
    eventDate: v.optional(v.union(v.string(), v.null())),
    shippingAddress: v.optional(v.union(v.string(), v.null())),
    occasion: v.optional(v.union(v.string(), v.null())),
    coverPhotoUri: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.listId, {
      title: args.title,
      note: args.note ?? null,
      eventDate: args.eventDate ?? null,
      shippingAddress: args.shippingAddress ?? null,
      occasion: args.occasion ?? null,
      coverPhotoUri: args.coverPhotoUri ?? null,
      updated_at: new Date().toISOString(),
    });
    return true;
  },
});

export const updateListPrivacy = mutation({
  args: {
    listId: v.id("lists"),
    privacy: v.union(v.literal("private"), v.literal("shared")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.listId, {
      privacy: args.privacy,
      updated_at: new Date().toISOString(),
    });
    return true;
  },
});

export const getListById = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.listId);
  },
});

export const getMyLists = query({
  args: { user_id: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    const userId = args.user_id ?? null;
    if (userId === null) return [];
    return await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .collect();
  },
});

// Contacts
export const getContacts = query({
  args: { owner_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("owner_id", args.owner_id))
      .collect();
  },
});

// Groups
export const getGroups = query({
  args: { owner_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groups")
      .withIndex("by_owner", (q) => q.eq("owner_id", args.owner_id))
      .collect();
  },
});

export const getGroupMembers = query({
  args: { group_id: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("group_id", args.group_id))
      .collect();
  },
});

// Share list with a group or contact
export const addListShare = mutation({
  args: {
    list_id: v.id("lists"),
    group_id: v.optional(v.id("groups")),
    contact_id: v.optional(v.id("contacts")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("list_shares", {
      list_id: args.list_id,
      group_id: args.group_id,
      contact_id: args.contact_id,
      created_at: new Date().toISOString(),
    });
    return true;
  },
});

export const getListShares = query({
  args: { list_id: v.id("lists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("list_shares")
      .withIndex("by_list", (q) => q.eq("list_id", args.list_id))
      .collect();
  },
});

export const setListShares = mutation({
  args: {
    list_id: v.id("lists"),
    group_ids: v.optional(v.array(v.id("groups"))),
    contact_ids: v.optional(v.array(v.id("contacts"))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("list_shares")
      .withIndex("by_list", (q) => q.eq("list_id", args.list_id))
      .collect();

    // Remove all existing shares for this list
    for (const share of existing) {
      await ctx.db.delete(share._id);
    }

    const now = new Date().toISOString();

    // Insert new group shares
    for (const gid of args.group_ids ?? []) {
      await ctx.db.insert("list_shares", {
        list_id: args.list_id,
        group_id: gid,
        created_at: now,
      } as any);
    }

    // Insert new contact shares
    for (const cid of args.contact_ids ?? []) {
      await ctx.db.insert("list_shares", {
        list_id: args.list_id,
        contact_id: cid,
        created_at: now,
      } as any);
    }

    return true;
  },
});

// Seed sample data for groups and contacts
export const seedShareData = internalMutation({
  args: { owner_id: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // Create contacts
    const contacts: Doc<"contacts">[] = [] as any;
    const contactData = [
      { name: "Will Smith", email: "willy_silly@gmail.com" },
      { name: "Scarlette Johanson", email: "scarrylady@gmail.com" },
      { name: "Barack Obama", email: "omama.mia@gmail.com" },
      { name: "John F. Kennedy", email: "johnnyjohnny_af@gmail.com" },
      { name: "Ronald Reagan", email: "ronnie.reagan@whiteshouse.gov" },
      { name: "Theodore Roosevelt", email: "teddy.roosevelt@progressive.com" },
    ];
    for (const c of contactData) {
      const id = await ctx.db.insert("contacts", {
        owner_id: args.owner_id,
        name: c.name,
        email: c.email,
        avatarUrl: null,
        created_at: now,
        updated_at: now,
      });
      contacts.push((await ctx.db.get(id)) as any);
    }

    // Create groups
    const groupNames = [
      "Class of 2023",
      "Office Mates",
      "Adam's Family",
      "Erin’s Classmates",
    ];
    const groupIds: Id<"groups">[] = [] as any;
    for (const name of groupNames) {
      const gid = await ctx.db.insert("groups", {
        owner_id: args.owner_id,
        name,
        coverPhotoUri: null,
        created_at: now,
        updated_at: now,
      });
      groupIds.push(gid);
    }

    // Add a few members to each group
    for (const gid of groupIds) {
      for (const contact of contacts.slice(0, 3)) {
        await ctx.db.insert("group_members", {
          group_id: gid,
          contact_id: contact._id as any,
          created_at: now,
        });
      }
    }

    return "ok";
  },
});

export const seedShareDataPublic = mutation({
  args: { owner_id: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // If user already has groups or contacts, skip to avoid duplicates
    const existingGroups = await ctx.db
      .query("groups")
      .withIndex("by_owner", (q) => q.eq("owner_id", args.owner_id))
      .collect();
    const existingContacts = await ctx.db
      .query("contacts")
      .withIndex("by_owner", (q) => q.eq("owner_id", args.owner_id))
      .collect();

    if (existingGroups.length > 0 || existingContacts.length > 0) {
      return "already-seeded";
    }

    // Contacts
    const contacts: Doc<"contacts">[] = [] as any;
    const contactData = [
      { name: "Will Smith", email: "willy_silly@gmail.com" },
      { name: "Scarlette Johanson", email: "scarrylady@gmail.com" },
      { name: "Barack Obama", email: "omama.mia@gmail.com" },
      { name: "John F. Kennedy", email: "johnnyjohnny_af@gmail.com" },
      { name: "Ronald Reagan", email: "ronnie.reagan@whiteshouse.gov" },
      { name: "Theodore Roosevelt", email: "teddy.roosevelt@progressive.com" },
    ];

    for (const c of contactData) {
      const id = await ctx.db.insert("contacts", {
        owner_id: args.owner_id,
        name: c.name,
        email: c.email,
        avatarUrl: null,
        created_at: now,
        updated_at: now,
      });
      const row = await ctx.db.get(id);
      if (row) contacts.push(row as any);
    }

    // Groups
    const groupNames = [
      "Class of 2023",
      "Office Mates",
      "Adam's Family",
      "Erin’s Classmates",
    ];
    const groupIds: Id<"groups">[] = [] as any;
    for (const name of groupNames) {
      const gid = await ctx.db.insert("groups", {
        owner_id: args.owner_id,
        name,
        coverPhotoUri: null,
        created_at: now,
        updated_at: now,
      });
      groupIds.push(gid);
    }

    // Add first 3 contacts to each group
    for (const gid of groupIds) {
      for (const contact of contacts.slice(0, 3)) {
        await ctx.db.insert("group_members", {
          group_id: gid,
          contact_id: contact._id as any,
          created_at: now,
        });
      }
    }

    return "ok";
  },
});

export const deleteList = mutation({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.listId);
    return true;
  },
});

export const createListItem = mutation({
  args: {
    list_id: v.id("lists"),
    name: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    image_url: v.optional(v.union(v.string(), v.null())),
    quantity: v.number(),
    price: v.optional(v.union(v.float64(), v.string(), v.null())),
    currency: v.optional(v.string()),
    buy_url: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("list_items", {
      list_id: args.list_id,
      name: args.name,
      description: args.description ?? null,
      image_url: args.image_url ?? null,
      quantity: args.quantity,
      claimed: 0,
      price: args.price ?? null,
      currency: args.currency ?? "AED",
      buy_url: args.buy_url ?? null,
      status: "active",
      created_at: now,
      updated_at: now,
    });
    return id;
  },
});

export const getListItems = query({
  args: { list_id: v.id("lists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("list_id", args.list_id))
      .collect();
  },
});

export const seedDummyListItem = mutation({
  args: { list_id: v.id("lists") },
  handler: async (ctx, args) => {
    // If already has items do nothing
    const existing = await ctx.db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("list_id", args.list_id))
      .collect();
    if (existing.length > 0) return "skipped";

    const now = new Date().toISOString();
    await ctx.db.insert("list_items", {
      list_id: args.list_id,
      name: "Apple AirPods Max wireless over-ear headphones", 
      description: "High-fidelity audio with Active Noise Cancellation and spatial audio.",
      image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-blue?wid=940&hei=1112&fmt=png-alpha&.v=1725380856538", 
      quantity: 2,
      claimed: 1,
      price: "1899.00",
      currency: "AED",
      buy_url: "https://www.apple.com/airpods-max/",
      status: "active",
      created_at: now,
      updated_at: now,
    });
    return "ok";
  },
});
