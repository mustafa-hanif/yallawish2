import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";

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

export const upsertUserProfile = mutation({
  args: {
    user_id: v.string(),
    displayName: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    phoneCountryCode: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    gender: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    location: v.optional(v.string()),
    persona: v.optional(v.string()),
    giftOccasions: v.array(v.string()),
    shareUpdates: v.boolean(),
    giftInterests: v.array(v.string()),
    giftShoppingStyle: v.optional(v.union(v.string(), v.null())),
    giftBudgetRange: v.optional(v.union(v.string(), v.null())),
    giftDiscoveryChannels: v.array(v.string()),
    favoriteStores: v.array(v.string()),
    reminderOptIn: v.boolean(),
    aiIdeasOptIn: v.boolean(),
    communityUpdatesOptIn: v.boolean(),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName ?? null,
        firstName: args.firstName ?? null,
        lastName: args.lastName ?? null,
        contactEmail: args.contactEmail ?? null,
        phoneCountryCode: args.phoneCountryCode ?? null,
        phoneNumber: args.phoneNumber ?? null,
        gender: args.gender ?? null,
        dateOfBirth: args.dateOfBirth ?? null,
        location: args.location ?? null,
        persona: args.persona ?? null,
        giftOccasions: args.giftOccasions,
        shareUpdates: args.shareUpdates,
        giftInterests: args.giftInterests,
        giftShoppingStyle: args.giftShoppingStyle ?? null,
        giftBudgetRange: args.giftBudgetRange ?? null,
        giftDiscoveryChannels: args.giftDiscoveryChannels,
        favoriteStores: args.favoriteStores,
        reminderOptIn: args.reminderOptIn,
        aiIdeasOptIn: args.aiIdeasOptIn,
        communityUpdatesOptIn: args.communityUpdatesOptIn,
        profileImageUrl: args.profileImageUrl ?? null,
        updated_at: now,
      });
      return existing._id;
    }

    const id = await ctx.db.insert("user_profiles", {
      user_id: args.user_id,
      displayName: args.displayName ?? null,
      firstName: args.firstName ?? null,
      lastName: args.lastName ?? null,
      contactEmail: args.contactEmail ?? null,
      phoneCountryCode: args.phoneCountryCode ?? null,
      phoneNumber: args.phoneNumber ?? null,
      gender: args.gender ?? null,
      dateOfBirth: args.dateOfBirth ?? null,
      location: args.location ?? null,
      persona: args.persona ?? null,
      giftOccasions: args.giftOccasions,
      shareUpdates: args.shareUpdates,
      giftInterests: args.giftInterests,
      giftShoppingStyle: args.giftShoppingStyle ?? null,
      giftBudgetRange: args.giftBudgetRange ?? null,
      giftDiscoveryChannels: args.giftDiscoveryChannels,
      favoriteStores: args.favoriteStores,
      reminderOptIn: args.reminderOptIn,
      aiIdeasOptIn: args.aiIdeasOptIn,
      communityUpdatesOptIn: args.communityUpdatesOptIn,
      profileImageUrl: args.profileImageUrl ?? null,
      created_at: now,
      updated_at: now,
    });
    return id;
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
    requiresPassword: v.optional(v.boolean()),
    password: v.optional(v.union(v.string(), v.null())),
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
      requiresPassword: args.requiresPassword ?? false,
      password: args.password ?? null,
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
    requiresPassword: v.optional(v.boolean()),
    password: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.listId, {
      privacy: args.privacy,
      requiresPassword: args.requiresPassword ?? false,
      password: args.password ?? null,
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

export const createContact = mutation({
  args: {
    owner_id: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    phoneCountryCode: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    relation: v.optional(v.string()),
    allowEdit: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("contacts", {
      owner_id: args.owner_id,
      name: args.name,
      email: args.email,
      avatarUrl: null,
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      gender: args.gender,
      phoneCountryCode: args.phoneCountryCode,
      phoneNumber: args.phoneNumber,
      relation: args.relation,
      allowEdit: args.allowEdit,
      created_at: now,
      updated_at: now,
    });
    return id;
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

// Save Expo push token for a user
export const savePushToken = mutation({
  args: { user_id: v.string(), token: v.string() },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // Upsert: if token exists for user, skip duplicate
    const existing = await ctx.db
      .query("push_tokens")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();
    const already = existing.find((t) => t.token === args.token);
    if (already) {
      await ctx.db.patch(already._id, { updated_at: now });
      return true;
    }
    await ctx.db.insert("push_tokens", {
      user_id: args.user_id,
      token: args.token,
      created_at: now,
      updated_at: now,
    });
    return true;
  },
});

// Internal action: send Expo push notification
export const sendPush = internalAction({
  args: { token: v.string(), title: v.string(), body: v.string() },
  handler: async (_ctx, args) => {
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          to: args.token,
          sound: "default",
          title: args.title,
          body: args.body,
        }),
      });
      const json = await res.json();
      console.log("Expo push result:", json);
      return true;
    } catch (e) {
      console.error("Expo push failed", e);
      return false;
    }
  },
});

// Request list password: stores request and notifies owner
export const requestListPassword = mutation({
  args: {
    list_id: v.id("lists"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // Store request
    await ctx.db.insert("password_requests", {
      list_id: args.list_id,
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      created_at: now,
    });

    // Lookup list owner
    const list = await ctx.db.get(args.list_id);
    const ownerId = list?.user_id ?? null;
    if (!ownerId) return true;

    // Fetch owner's push tokens
    const tokens = await ctx.db
      .query("push_tokens")
      .withIndex("by_user", (q) => q.eq("user_id", ownerId))
      .collect();

    // Fire-and-forget push via internal action
    const title = "Password requested";
    const body = `${args.firstName} ${args.lastName} requested your list password`;
    for (const t of tokens) {
      await ctx.scheduler.runAfter(0, internal.products.sendPush, {
        token: t.token,
        title,
        body,
      });
    }
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

export const getListItemById = query({
  args: { itemId: v.id("list_items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
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

export const setListItemClaim = mutation({
  args: { itemId: v.id("list_items"), claimed: v.number() },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.itemId);
    if (!row) return false;
    const next = Math.max(0, Math.min(args.claimed, row.quantity));
    await ctx.db.patch(args.itemId, { claimed: next, updated_at: new Date().toISOString() });
    return true;
  },
});

// Increment claimed quantity by a delta; clamps to [0, quantity]
export const addListItemClaim = mutation({
  args: { itemId: v.id("list_items"), add: v.number() },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.itemId);
    if (!row) return false;
    const current = Number(row.claimed ?? 0);
    const qty = Number(row.quantity ?? 0);
    const next = Math.max(0, Math.min(current + Math.max(0, args.add), qty));
    await ctx.db.patch(args.itemId, { claimed: next, updated_at: new Date().toISOString() });
    return true;
  },
});

// Purchase list item: records the purchase and increments claimed safely
export const purchaseListItem = mutation({
  args: {
    list_id: v.id("lists"),
    item_id: v.id("list_items"),
    quantity: v.number(),
    deliveredTo: v.union(v.literal("recipient"), v.literal("me")),
    note: v.optional(v.union(v.string(), v.null())),
    storeName: v.optional(v.union(v.string(), v.null())),
    orderNumber: v.optional(v.union(v.string(), v.null())),
    buyer_user_id: v.optional(v.union(v.string(), v.null())),
    buyer_name: v.optional(v.union(v.string(), v.null())),
    buyer_email: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.item_id);
    if (!item) return false;
    const now = new Date().toISOString();
    // Clamp quantity to available
    const current = Number(item.claimed ?? 0);
    const maxQty = Number(item.quantity ?? 0);
    const add = Math.max(0, Math.min(args.quantity, Math.max(0, maxQty - current)));
    if (add <= 0) return false;

    // Update claimed
    await ctx.db.patch(args.item_id, { claimed: current + add, updated_at: now });

    // Insert purchase record
    await ctx.db.insert("purchases", {
      list_id: args.list_id,
      item_id: args.item_id,
      quantity: add,
      deliveredTo: args.deliveredTo,
      note: args.note ?? null,
      storeName: args.storeName ?? null,
      orderNumber: args.orderNumber ?? null,
      buyer_user_id: args.buyer_user_id ?? null,
      buyer_name: args.buyer_name ?? null,
      buyer_email: args.buyer_email ?? null,
      created_at: now,
      updated_at: now,
    });
    return true;
  },
});
