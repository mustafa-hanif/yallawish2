import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// {"id":1,"user_id":null,"name":"Nothing Phone (3a) 128 GB - mobile phone with 32 MP front camera, 30x ultra zoom, 50W fast charging and 6.77\" FHD+ flexible AMOLED display - White","price":"999.00","description":null,"category":"Electronics","status":"active","in_stock":true,"keyword":"mobile","rating":"4.60","review_count":38,"image_url":"https://m.media-amazon.com/images/I/61lN7lxvAFL._AC_UL320_.jpg","source_url":"https://amazon.ae/sspa/click?ie=UTF8&spc=MTo2MTcwOTc3NzU2MTk2OTY4OjE3NTA0MjgzMTY6c3BfYXRmOjMwMDUxMjA4MDczMjIzMjo6MDo6&url=%2FNothing-Phone-3a-128-GB%2Fdp%2FB0DYD8XWH8%2Fref%3Dsr_1_1_sspa%3Fdib%3DeyJ2IjoiMSJ9.F6XW9GBJob4WjDiCK1zwo4nMAO97YOQ5Sr0EJrBq9BrsmwGz7S0XNkKKEpceRzWtDkrvo4juRP_QmJHgi-B-v0IEFHCttsyqoPTRbk8kMzYnfnTBc8JfkCrvdjb21f4Ftnk3Fz3m8TWQ16l0U3lYCzOKuff3bMu6Kjlddq0i3q4Mg-hGZDjvW_KCnx2yn4R59UZc6zU7djS9jhoIyijBUQgkQ04KOos13f5dWCwNT2cO03lJ0DDvDOQ2ACm8h-RjncYyJ0udFe_JSkwjW5YXpaLL9hMg677sRG8YLOMRYt4.BIv2bRIOkSRH7e-UNeNRiPVXI5rIT4gUnEMs5ZaOOZQ%26dib_tag%3Dse%26keywords%3Dmobile%26qid%3D1750428316%26sr%3D8-1-spons%26sp_csd%3Dd2lkZ2V0TmFtZT1zcF9hdGY%26psc%3D1","source_type":"amazon","created_at":"2025-06-20T14:05:19.582Z","updated_at":"2025-06-20T14:05:19.582Z"}
export default defineSchema({
  products: defineTable({
    id: v.optional(v.number()),
    user_id: v.optional(v.union(v.string(), v.null())),
    name: v.string(),
    price: v.union(v.float64(), v.string(), v.null()),
    description: v.optional(v.union(v.string(), v.null())),
    category: v.string(),
    status: v.string(),
    in_stock: v.boolean(),
    keyword: v.string(),
    rating: v.union(v.string(), v.float64(), v.null()),
    review_count: v.number(),
    image_url: v.string(),
    source_url: v.string(),
    source_type: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_keyword", ["keyword"]),
  // New table to store user-created gift lists
  lists: defineTable({
    user_id: v.optional(v.union(v.string(), v.null())),
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
    isArchived: v.optional(v.boolean()),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user", ["user_id"]),

  // Contacts (friends) owned by a user
  contacts: defineTable({
    owner_id: v.string(), // Clerk user id of owner
    name: v.string(),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.union(v.string(), v.null())),
    // Extended profile fields
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
    phoneCountryCode: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    relation: v.optional(v.string()),
    allowEdit: v.optional(v.boolean()),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_owner", ["owner_id"]),

  // Groups owned by a user
  groups: defineTable({
    owner_id: v.string(), // Clerk user id of owner
    name: v.string(),
    coverPhotoUri: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_owner", ["owner_id"]),

  // Group membership linking groups to contacts
  group_members: defineTable({
    group_id: v.id("groups"),
    contact_id: v.id("contacts"),
    created_at: v.string(),
  })
    .index("by_group", ["group_id"])
    .index("by_contact", ["contact_id"]),

  // List shares: which groups or contacts can access a list when shared
  list_shares: defineTable({
    list_id: v.id("lists"),
    group_id: v.optional(v.id("groups")),
    contact_id: v.optional(v.id("contacts")),
    created_at: v.string(),
  })
    .index("by_list", ["list_id"])
    .index("by_group", ["group_id"])
    .index("by_contact", ["contact_id"]),

  // Gift items belonging to a list
  list_items: defineTable({
    list_id: v.id("lists"),
    name: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    image_url: v.optional(v.union(v.string(), v.null())),
    quantity: v.number(),
    claimed: v.number(),
    price: v.optional(v.union(v.float64(), v.string(), v.null())),
    currency: v.optional(v.string()),
    buy_url: v.optional(v.union(v.string(), v.null())),
    status: v.union(v.literal("active"), v.literal("archived")),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_list", ["list_id"])
    .index("by_list_status", ["list_id", "status"]),

  // Expo push tokens for users
  push_tokens: defineTable({
    user_id: v.string(),
    token: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user", ["user_id"]),

  user_profiles: defineTable({
    user_id: v.string(),
    displayName: v.optional(v.union(v.string(), v.null())),
    firstName: v.optional(v.union(v.string(), v.null())),
    lastName: v.optional(v.union(v.string(), v.null())),
    contactEmail: v.optional(v.union(v.string(), v.null())),
    phoneCountryCode: v.optional(v.union(v.string(), v.null())),
    phoneNumber: v.optional(v.union(v.string(), v.null())),
    gender: v.optional(v.union(v.string(), v.null())),
    dateOfBirth: v.optional(v.union(v.string(), v.null())),
    location: v.optional(v.union(v.string(), v.null())),
    persona: v.optional(v.union(v.string(), v.null())),
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
    profileImageUrl: v.optional(v.union(v.string(), v.null())),
    created_at: v.string(),
    updated_at: v.string(),
  }).index("by_user", ["user_id"]),

  // Requests to view password-protected lists
  password_requests: defineTable({
    list_id: v.id("lists"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    created_at: v.string(),
  }).index("by_list", ["list_id"]),

  // Purchases made for list items
  purchases: defineTable({
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
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_item", ["item_id"])
    .index("by_list", ["list_id"]),
});
