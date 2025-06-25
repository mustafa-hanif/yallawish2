import { Doc } from "@/convex/_generated/dataModel";
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const get = query({
  args: {
    keyword: v.optional(v.string()),
  },
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
