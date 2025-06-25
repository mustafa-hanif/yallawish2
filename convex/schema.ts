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
});
