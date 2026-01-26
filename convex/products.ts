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

export const getUserProfileByUserId = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .first();
    return profile ?? null;
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
    coverPhotoStorageId: v.optional(v.union(v.string(), v.null())),
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
      coverPhotoStorageId: args.coverPhotoStorageId ?? null,
      privacy: args.privacy,
      requiresPassword: args.requiresPassword ?? false,
      password: args.password ?? null,
      isArchived: false,
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
    coverPhotoStorageId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.listId, {
      ...(args.title ? { title: args.title } : {}),
      ...(args.note !== undefined ? { note: args.note } : {}),
      ...(args.eventDate !== undefined ? { eventDate: args.eventDate } : {}),
      ...(args.shippingAddress !== undefined ? { shippingAddress: args.shippingAddress } : {}),
      ...(args.occasion !== undefined ? { occasion: args.occasion } : {}),
      ...(args.coverPhotoUri !== undefined ? { coverPhotoUri: args.coverPhotoUri } : {}),
      ...(args.coverPhotoStorageId !== undefined ? { coverPhotoStorageId: args.coverPhotoStorageId } : {}),
      updated_at: new Date().toISOString(),
    });
    return true;
  },
});

export const generateListCoverUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getListCoverUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId as any);
    if (!url) {
      throw new Error("Failed to resolve cover photo URL");
    }
    return url;
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

// Toggle list archived state
export const setListArchived = mutation({
  args: { listId: v.id("lists"), isArchived: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.listId, {
      isArchived: args.isArchived,
      updated_at: new Date().toISOString(),
    });
    return true;
  },
});

// Flip archived state for a list; returns the new state
export const toggleListArchived = mutation({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) return false as any;
    const next = !Boolean((list as any).isArchived);
    await ctx.db.patch(args.listId, { isArchived: next, updated_at: new Date().toISOString() });
    return next as any;
  },
});

export const getListById = query({
  args: { listId: v.id("lists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) {
      return null;
    }
    let coverPhotoUri = list.coverPhotoUri ?? null;
    if (list.coverPhotoStorageId) {
      const refreshed = await ctx.storage.getUrl(list.coverPhotoStorageId as any);
      if (refreshed) {
        coverPhotoUri = refreshed;
      }
    }
    // Resolve creator profile (list owner) from user_profiles.by_user
    let creator: any = null;
    const uid = (list.user_id ?? null) as string | null;
    if (uid) {
      const profile = await ctx.db
        .query("user_profiles")
        .withIndex("by_user", (q) => q.eq("user_id", uid))
        .first();
      if (profile) {
        creator = {
          user_id: profile.user_id,
          firstName: profile.firstName ?? null,
          lastName: profile.lastName ?? null,
          profileImageUrl: profile.profileImageUrl ?? null,
          contactEmail: profile.contactEmail ?? null,
        } as any;
      }
    }

    return { ...list, coverPhotoUri, creator };
  },
});

export const getMyLists = query({
  args: { user_id: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    const userId = args.user_id ?? null;
    if (userId === null) return [];
    const lists = await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("user_id", userId))
      .collect();
    return await Promise.all(
      lists.map(async (list) => {
        let coverPhotoUri = list.coverPhotoUri ?? null;
        if (list.coverPhotoStorageId) {
          const refreshed = await ctx.storage.getUrl(list.coverPhotoStorageId as any);
          if (refreshed) {
            coverPhotoUri = refreshed;
          }
        }

        // Aggregate list item counts for this list
        const items = await ctx.db
          .query("list_items")
          .withIndex("by_list", (q) => q.eq("list_id", list._id))
          .collect();
        const totalItems = items.length;
        const totalClaimed = items.reduce((s: number, it: any) => s + Number(it.claimed ?? 0), 0);

        let creator: any = null;
        const uid = (list.user_id ?? null) as string | null;
        if (uid) {
          const profile = await ctx.db
            .query("user_profiles")
            .withIndex("by_user", (q) => q.eq("user_id", uid))
            .first();
          if (profile) {
            creator = {
              user_id: profile.user_id,
              firstName: profile.firstName ?? null,
              lastName: profile.lastName ?? null,
              profileImageUrl: profile.profileImageUrl ?? null,
              contactEmail: profile.contactEmail ?? null,
            } as any;
          }
        }

        return { ...list, coverPhotoUri, totalItems, totalClaimed, creator };
      }),
    );
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

export const getListsByGroup = query({
  args: { group_id: v.id("groups") },
  handler: async (ctx, args) => {
    // Get all list shares for this group
    const listShares = await ctx.db
      .query("list_shares")
      .withIndex("by_group", (q) => q.eq("group_id", args.group_id))
      .collect();

    // Get unique list IDs and fetch list details
    const listIds = [...new Set(listShares.map((share) => share.list_id))];
    const lists = await Promise.all(
      listIds.map(async (listId) => {
        const list = await ctx.db.get(listId);
        return list;
      }),
    );

    // Filter out null values and return
    return lists.filter((list) => list !== null);
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
    const groupNames = ["Class of 2023", "Office Mates", "Adam's Family", "Erin’s Classmates"];
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
    // Note: This seed function is outdated - group_members now uses user_id from user_connections
    // Skipping group member creation in this seed function
    // for (const gid of groupIds) {
    //   for (const contact of contacts.slice(0, 3)) {
    //     await ctx.db.insert("group_members", {
    //       group_id: gid,
    //       user_id: args.owner_id, // Would need actual user IDs from connections
    //       is_admin: false,
    //       created_at: now,
    //     });
    //   }
    // }

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
    const groupNames = ["Class of 2023", "Office Mates", "Adam's Family", "Erin’s Classmates"];
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
    // Note: This seed function is outdated - group_members now uses user_id from user_connections
    // Skipping group member creation in this seed function
    // for (const gid of groupIds) {
    //   for (const contact of contacts.slice(0, 3)) {
    //     await ctx.db.insert("group_members", {
    //       group_id: gid,
    //       user_id: args.owner_id, // Would need actual user IDs from connections
    //       is_admin: false,
    //       created_at: now,
    //     });
    //   }
    // }

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

export const deleteListItem = mutation({
  args: { itemId: v.id("list_items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
    return true;
  },
});

// Public community lists (shared) not created by the provided user
export const getCommunityLists = query({
  args: { exclude_user_id: v.optional(v.union(v.string(), v.null())) },
  handler: async (ctx, args) => {
    const excludeUserId = args.exclude_user_id ?? null;

    // Collect all lists and filter client-side for privacy and ownership
    const allLists = await ctx.db.query("lists").collect();
    const lists = allLists.filter((l: any) => l.privacy === "shared" && (l.user_id ?? null) !== excludeUserId);

    return await Promise.all(
      lists.map(async (list: any) => {
        let coverPhotoUri = list.coverPhotoUri ?? null;
        if (list.coverPhotoStorageId) {
          const refreshed = await ctx.storage.getUrl(list.coverPhotoStorageId as any);
          if (refreshed) coverPhotoUri = refreshed;
        }

        // Aggregate list item counts for this list
        const items = await ctx.db
          .query("list_items")
          .withIndex("by_list", (q) => q.eq("list_id", list._id))
          .collect();
        const totalItems = items.length;
        const totalClaimed = items.reduce((s: number, it: any) => s + Number(it.claimed ?? 0), 0);

        // Attach creator profile: try local `user_profiles` first, then Clerk API fallback.
        let creator: any = null;
        const uid = (list.user_id ?? null) as string | null;
        if (uid) {
          const profile = await ctx.db
            .query("user_profiles")
            .withIndex("by_user", (q) => q.eq("user_id", uid))
            .first();
          if (profile) {
            creator = {
              user_id: profile.user_id,
              firstName: profile.firstName ?? null,
              lastName: profile.lastName ?? null,
              profileImageUrl: profile.profileImageUrl ?? null,
              contactEmail: profile.contactEmail ?? null,
            } as any;
          }
        }

        return { ...list, coverPhotoUri, totalItems, totalClaimed, creator };
      }),
    );
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

export const getUserProfiles = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("user_profiles").collect();
    return users.filter((u) => u.user_id !== args.user_id);
  },
});

// ============ FRIEND CONNECTION MUTATIONS ============

export const sendFriendRequest = mutation({
  args: {
    requester_id: v.string(),
    receiver_id: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate users exist
    const requester = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.requester_id))
      .first();

    const receiver = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("user_id", args.receiver_id))
      .first();

    if (!requester || !receiver) {
      throw new Error("One or both users do not exist");
    }

    // Check if connection already exists (either direction)
    const existingConnection1 = await ctx.db
      .query("user_connections")
      .withIndex("by_both_users", (q) => q.eq("requester_id", args.requester_id).eq("receiver_id", args.receiver_id))
      .first();

    const existingConnection2 = await ctx.db
      .query("user_connections")
      .withIndex("by_both_users", (q) => q.eq("requester_id", args.receiver_id).eq("receiver_id", args.requester_id))
      .first();

    if (existingConnection1 || existingConnection2) {
      const existing = existingConnection1 || existingConnection2;
      if (existing?.status === "blocked") {
        throw new Error("Cannot send friend request to blocked user");
      }
      if (existing?.status === "accepted") {
        throw new Error("Already friends");
      }
      if (existing?.status === "pending") {
        throw new Error("Friend request already sent");
      }
    }

    // Create pending connection
    const connectionId = await ctx.db.insert("user_connections", {
      requester_id: args.requester_id,
      receiver_id: args.receiver_id,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return connectionId;
  },
});

export const acceptFriendRequest = mutation({
  args: {
    connection_id: v.id("user_connections"),
    user_id: v.string(), // Current user accepting the request
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db.get(args.connection_id);

    if (!connection) {
      throw new Error("Friend request not found");
    }

    // Verify the current user is the receiver
    if (connection.receiver_id !== args.user_id) {
      throw new Error("You can only accept requests sent to you");
    }

    if (connection.status !== "pending") {
      throw new Error("Request is not pending");
    }

    // Update status to accepted
    await ctx.db.patch(args.connection_id, {
      status: "accepted",
      updated_at: new Date().toISOString(),
    });

    return true;
  },
});

export const rejectFriendRequest = mutation({
  args: {
    connection_id: v.id("user_connections"),
    user_id: v.string(), // Current user rejecting the request
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db.get(args.connection_id);

    if (!connection) {
      throw new Error("Friend request not found");
    }

    // Verify the current user is the receiver
    if (connection.receiver_id !== args.user_id) {
      throw new Error("You can only reject requests sent to you");
    }

    if (connection.status !== "pending") {
      throw new Error("Request is not pending");
    }

    // Delete the connection
    await ctx.db.delete(args.connection_id);

    return true;
  },
});

export const blockUser = mutation({
  args: {
    blocker_id: v.string(),
    blocked_id: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.blocker_id === args.blocked_id) {
      throw new Error("Cannot block yourself");
    }

    // Check if connection already exists (either direction)
    const existingConnection1 = await ctx.db
      .query("user_connections")
      .withIndex("by_both_users", (q) => q.eq("requester_id", args.blocker_id).eq("receiver_id", args.blocked_id))
      .first();

    const existingConnection2 = await ctx.db
      .query("user_connections")
      .withIndex("by_both_users", (q) => q.eq("requester_id", args.blocked_id).eq("receiver_id", args.blocker_id))
      .first();

    // Delete any existing connection
    if (existingConnection1) {
      await ctx.db.delete(existingConnection1._id);
    }
    if (existingConnection2) {
      await ctx.db.delete(existingConnection2._id);
    }

    // Create new blocked connection
    const connectionId = await ctx.db.insert("user_connections", {
      requester_id: args.blocker_id,
      receiver_id: args.blocked_id,
      status: "blocked",
      blocked_by: args.blocker_id, // Explicitly track who blocked
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return connectionId;
  },
});

export const removeFriend = mutation({
  args: {
    connection_id: v.id("user_connections"),
    user_id: v.string(), // Current user removing the friend
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db.get(args.connection_id);

    if (!connection) {
      throw new Error("Friend connection not found");
    }

    // Verify the current user is part of this connection
    if (connection.requester_id !== args.user_id && connection.receiver_id !== args.user_id) {
      throw new Error("You can only remove your own friends");
    }

    if (connection.status !== "accepted") {
      throw new Error("Not friends");
    }

    // Delete the connection
    await ctx.db.delete(args.connection_id);

    return true;
  },
});

export const updateFriendNotes = mutation({
  args: {
    connection_id: v.id("user_connections"),
    user_id: v.string(),
    personal_note: v.optional(v.string()),
    custom_display_name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db.get(args.connection_id);

    if (!connection) {
      throw new Error("Friend connection not found");
    }

    // Verify the current user is part of this connection
    if (connection.requester_id !== args.user_id && connection.receiver_id !== args.user_id) {
      throw new Error("You can only update your own notes");
    }

    if (connection.status !== "accepted") {
      throw new Error("Not friends");
    }

    // Determine which fields to update based on user's role
    const isRequester = connection.requester_id === args.user_id;
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (args.personal_note !== undefined) {
      if (isRequester) {
        updates.requester_note = args.personal_note;
      } else {
        updates.receiver_note = args.personal_note;
      }
    }

    if (args.custom_display_name !== undefined) {
      if (isRequester) {
        updates.requester_custom_name = args.custom_display_name;
      } else {
        updates.receiver_custom_name = args.custom_display_name;
      }
    }

    await ctx.db.patch(args.connection_id, updates);

    return true;
  },
});

// ============ FRIEND CONNECTION QUERIES ============

export const getMyFriends = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    // Get all accepted connections where user is requester or receiver
    const connectionsAsRequester = await ctx.db
      .query("user_connections")
      .withIndex("by_requester_and_status", (q) => q.eq("requester_id", args.user_id).eq("status", "accepted"))
      .collect();

    const connectionsAsReceiver = await ctx.db
      .query("user_connections")
      .withIndex("by_receiver_and_status", (q) => q.eq("receiver_id", args.user_id).eq("status", "accepted"))
      .collect();

    // Combine and get friend user IDs
    const allConnections = [...connectionsAsRequester, ...connectionsAsReceiver];
    const friendUserIds = allConnections.map((conn) => (conn.requester_id === args.user_id ? conn.receiver_id : conn.requester_id));

    // Fetch user profiles for all friends
    const friendProfiles = await Promise.all(
      friendUserIds.map(async (friendId) => {
        const profile = await ctx.db
          .query("user_profiles")
          .withIndex("by_user", (q) => q.eq("user_id", friendId))
          .first();
        return profile;
      }),
    );

    // Return friends with connection info and personal data
    return allConnections.map((conn, index) => {
      const isRequester = conn.requester_id === args.user_id;
      return {
        connection: conn,
        profile: friendProfiles[index],
        // Include user's personal note and custom name for this friend
        myPersonalNote: isRequester ? conn.requester_note : conn.receiver_note,
        myCustomName: isRequester ? conn.requester_custom_name : conn.receiver_custom_name,
      };
    });
  },
});

export const getReceivedRequests = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    // Get pending requests where user is the receiver
    const requests = await ctx.db
      .query("user_connections")
      .withIndex("by_receiver_and_status", (q) => q.eq("receiver_id", args.user_id).eq("status", "pending"))
      .collect();

    // Fetch requester profiles
    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const profile = await ctx.db
          .query("user_profiles")
          .withIndex("by_user", (q) => q.eq("user_id", request.requester_id))
          .first();
        return {
          connection: request,
          profile,
        };
      }),
    );

    return requestsWithProfiles;
  },
});

export const getSentRequests = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    // Get pending requests where user is the requester
    const requests = await ctx.db
      .query("user_connections")
      .withIndex("by_requester_and_status", (q) => q.eq("requester_id", args.user_id).eq("status", "pending"))
      .collect();

    // Fetch receiver profiles
    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const profile = await ctx.db
          .query("user_profiles")
          .withIndex("by_user", (q) => q.eq("user_id", request.receiver_id))
          .first();
        return {
          connection: request,
          profile,
        };
      }),
    );

    return requestsWithProfiles;
  },
});

export const searchUsers = query({
  args: {
    user_id: v.string(),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all user connections (friends, pending, blocked)
    const myConnectionsAsRequester = await ctx.db
      .query("user_connections")
      .withIndex("by_requester", (q) => q.eq("requester_id", args.user_id))
      .collect();

    const myConnectionsAsReceiver = await ctx.db
      .query("user_connections")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", args.user_id))
      .collect();

    const allConnections = [...myConnectionsAsRequester, ...myConnectionsAsReceiver];

    // Get set of user IDs to exclude
    const excludedUserIds = new Set([args.user_id]);
    allConnections.forEach((conn) => {
      const otherUserId = conn.requester_id === args.user_id ? conn.receiver_id : conn.requester_id;
      excludedUserIds.add(otherUserId);
    });

    // Get all user profiles
    const allUsers = await ctx.db.query("user_profiles").collect();

    // Filter users
    const filteredUsers = allUsers.filter((user) => {
      // Exclude self and existing connections
      if (excludedUserIds.has(user.user_id)) {
        return false;
      }

      // Apply search filter if provided
      if (args.searchText && args.searchText.trim() !== "") {
        const searchLower = args.searchText.toLowerCase();
        const name = user.displayName || "";
        const email = user.contactEmail || "";
        return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower);
      }

      return true;
    });

    return filteredUsers;
  },
});

export const getConnectionStatus = query({
  args: {
    user_id: v.string(),
    other_user_id: v.string(),
  },
  handler: async (ctx, args) => {
    // Check connection in both directions
    const connection1 = await ctx.db
      .query("user_connections")
      .withIndex("by_both_users", (q) => q.eq("requester_id", args.user_id).eq("receiver_id", args.other_user_id))
      .first();

    const connection2 = await ctx.db
      .query("user_connections")
      .withIndex("by_both_users", (q) => q.eq("requester_id", args.other_user_id).eq("receiver_id", args.user_id))
      .first();

    const connection = connection1 || connection2;

    if (!connection) {
      return { status: "none", connection: null };
    }

    // Determine the perspective
    let perspective: "sent" | "received" | "mutual" = "mutual";
    if (connection.status === "pending") {
      perspective = connection.requester_id === args.user_id ? "sent" : "received";
    }

    return {
      status: connection.status,
      connection,
      perspective,
    };
  },
});

export const getAllUsersWithConnectionStatus = query({
  args: {
    user_id: v.string(),
    searchText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get all user profiles except current user
    const allUsers = await ctx.db.query("user_profiles").collect();
    const otherUsers = allUsers.filter((u) => u.user_id !== args.user_id);

    // Get all connections for current user (both directions)
    const connectionsAsRequester = await ctx.db
      .query("user_connections")
      .withIndex("by_requester", (q) => q.eq("requester_id", args.user_id))
      .collect();

    const connectionsAsReceiver = await ctx.db
      .query("user_connections")
      .withIndex("by_receiver", (q) => q.eq("receiver_id", args.user_id))
      .collect();

    // Create a map of user_id -> connection info
    const connectionMap = new Map<string, { status: string; perspective: "sent" | "received" | "mutual" }>();

    connectionsAsRequester.forEach((conn) => {
      let perspective: "sent" | "received" | "mutual" = "mutual";
      if (conn.status === "pending") {
        perspective = "sent";
      } else if (conn.status === "blocked") {
        // Use blocked_by field to determine who blocked whom
        perspective = conn.blocked_by === args.user_id ? "sent" : "received";
      } else if (conn.status === "accepted") {
        perspective = "mutual";
      }
      connectionMap.set(conn.receiver_id, { status: conn.status, perspective });
    });

    connectionsAsReceiver.forEach((conn) => {
      let perspective: "sent" | "received" | "mutual" = "mutual";
      if (conn.status === "pending") {
        perspective = "received";
      } else if (conn.status === "blocked") {
        // Use blocked_by field to determine who blocked whom
        perspective = conn.blocked_by === args.user_id ? "sent" : "received";
      } else if (conn.status === "accepted") {
        perspective = "mutual";
      }
      connectionMap.set(conn.requester_id, { status: conn.status, perspective });
    });

    // Map users with their connection status
    let usersWithStatus = otherUsers.map((user) => {
      const connectionInfo = connectionMap.get(user.user_id);
      return {
        ...user,
        connectionStatus: connectionInfo?.status || "none",
        connectionPerspective: connectionInfo?.perspective || null,
      };
    });

    // Filter out blocked users (both directions)
    usersWithStatus = usersWithStatus.filter((user) => user.connectionStatus !== "blocked");

    // Apply search filter if provided
    if (args.searchText && args.searchText.trim() !== "") {
      const searchLower = args.searchText.toLowerCase();
      usersWithStatus = usersWithStatus.filter((user) => {
        const name = user.displayName || "";
        const email = user.contactEmail || "";
        return name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower);
      });
    }

    return usersWithStatus;
  },
});

// ============================================================================
// GROUP/CIRCLE MUTATIONS
// ============================================================================

export const createGroup = mutation({
  args: {
    owner_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    coverPhotoUri: v.optional(v.string()),
    coverPhotoStorageId: v.optional(v.string()),
    member_user_ids: v.array(v.string()), // YallaWish friend user IDs to add as members
    admin_user_ids: v.array(v.string()), // Subset of member_user_ids who are admins
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // Create the group
    const groupId = await ctx.db.insert("groups", {
      owner_id: args.owner_id,
      name: args.name,
      description: args.description || null,
      coverPhotoUri: args.coverPhotoUri || null,
      coverPhotoStorageId: args.coverPhotoStorageId || null,
      created_at: now,
      updated_at: now,
    });

    // Add owner as super admin member
    await ctx.db.insert("group_members", {
      group_id: groupId,
      user_id: args.owner_id,
      is_admin: true,
      created_at: now,
    });

    // Add all selected members
    for (const userId of args.member_user_ids) {
      // Skip if user is already owner (to avoid duplicate)
      if (userId === args.owner_id) continue;

      const isAdmin = args.admin_user_ids.includes(userId);
      await ctx.db.insert("group_members", {
        group_id: groupId,
        user_id: userId,
        is_admin: isAdmin,
        created_at: now,
      });
    }

    return groupId;
  },
});

export const getGroups = query({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    // Get all groups where user is a member
    const memberships = await ctx.db
      .query("group_members")
      .withIndex("by_user", (q) => q.eq("user_id", args.user_id))
      .collect();

    // Fetch full group details for each membership
    const groups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.group_id);
        if (!group) return null;

        // Get member count
        const allMembers = await ctx.db
          .query("group_members")
          .withIndex("by_group", (q) => q.eq("group_id", membership.group_id))
          .collect();

        // Get all lists shared with this group
        const listShares = await ctx.db
          .query("list_shares")
          .withIndex("by_group", (q) => q.eq("group_id", membership.group_id))
          .collect();

        // Get unique list IDs and fetch list details
        const listIds = [...new Set(listShares.map((share) => share.list_id))];
        const lists = await Promise.all(listIds.map((listId) => ctx.db.get(listId)));
        const validLists = lists.filter((list) => list !== null);

        // Count unique occasions
        const occasions = [...new Set(validLists.map((list) => list?.occasion).filter(Boolean))];

        // Find next upcoming event
        const now = new Date();
        const upcomingLists = validLists.filter((list) => list?.eventDate && new Date(list.eventDate) > now).sort((a, b) => new Date(a!.eventDate!).getTime() - new Date(b!.eventDate!).getTime());

        const nextEventDate = upcomingLists.length > 0 ? upcomingLists[0]?.eventDate : null;

        return {
          ...group,
          memberCount: allMembers.length,
          giftListCount: validLists.length,
          occasionCount: occasions.length,
          nextEventDate: nextEventDate,
          isOwner: group.owner_id === args.user_id,
          isAdmin: membership.is_admin,
          membership,
        };
      }),
    );

    // Filter out null values and return
    return groups.filter((g) => g !== null);
  },
});

export const getGroupById = query({
  args: { group_id: v.id("groups"), user_id: v.string() },
  handler: async (ctx, args) => {
    // Get the group
    const group = await ctx.db.get(args.group_id);
    if (!group) return null;

    // Get member count
    const allMembers = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("group_id", args.group_id))
      .collect();

    // Check if user is member
    const membership = allMembers.find((m) => m.user_id === args.user_id);
    if (!membership) return null; // User is not a member

    // Get all lists shared with this group
    const listShares = await ctx.db
      .query("list_shares")
      .withIndex("by_group", (q) => q.eq("group_id", args.group_id))
      .collect();

    // Get unique list IDs and fetch list details
    const listIds = [...new Set(listShares.map((share) => share.list_id))];
    const lists = await Promise.all(listIds.map((listId) => ctx.db.get(listId)));
    const validLists = lists.filter((list) => list !== null);

    // Count unique occasions
    const occasions = [...new Set(validLists.map((list) => list?.occasion).filter(Boolean))];

    // Find next upcoming event
    const now = new Date();
    const upcomingLists = validLists.filter((list) => list?.eventDate && new Date(list.eventDate) > now).sort((a, b) => new Date(a!.eventDate!).getTime() - new Date(b!.eventDate!).getTime());

    const nextEventDate = upcomingLists.length > 0 ? upcomingLists[0]?.eventDate : null;

    return {
      ...group,
      memberCount: allMembers.length,
      giftListCount: validLists.length,
      occasionCount: occasions.length,
      nextEventDate: nextEventDate,
      isOwner: group.owner_id === args.user_id,
      isAdmin: membership.is_admin,
      membership,
    };
  },
});

export const getGroupMembers = query({
  args: { group_id: v.id("groups") },
  handler: async (ctx, args) => {
    // Get all members of the group
    const memberships = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("group_id", args.group_id))
      .collect();

    // Fetch user profiles for each member
    const membersWithProfiles = await Promise.all(
      memberships.map(async (membership) => {
        // Skip legacy entries without user_id (old contact-based records)
        if (!membership.user_id) {
          return {
            ...membership,
            profile: null,
          };
        }

        const profile = await ctx.db
          .query("user_profiles")
          .withIndex("by_user", (q) => q.eq("user_id", membership.user_id!))
          .first();

        return {
          ...membership,
          profile,
        };
      }),
    );

    return membersWithProfiles;
  },
});

export const updateGroupMemberAdminStatus = mutation({
  args: {
    group_id: v.id("groups"),
    user_id: v.string(),
    is_admin: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Find the membership record
    const membership = await ctx.db
      .query("group_members")
      .withIndex("by_group_and_user", (q) => q.eq("group_id", args.group_id).eq("user_id", args.user_id))
      .first();

    if (!membership) {
      throw new Error("Membership not found");
    }

    // Update admin status
    await ctx.db.patch(membership._id, {
      is_admin: args.is_admin,
    });

    return membership._id;
  },
});

export const deleteGroup = mutation({
  args: { group_id: v.id("groups") },
  handler: async (ctx, args) => {
    // Delete all members first
    const members = await ctx.db
      .query("group_members")
      .withIndex("by_group", (q) => q.eq("group_id", args.group_id))
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete the group
    await ctx.db.delete(args.group_id);

    return { success: true };
  },
});
