import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

export const fetchProducts = action({
  args: { keyword: v.string() },
  handler: async (ctx, args) => {
    // implementation goes here
    let results = [];
    try {
      console.log("Fetching products for keyword:", args.keyword);
      const response = await fetch(
        `https://admin.yallawish.com/api/amazon/${args.keyword}/15`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched products:", data);
      results = data.savedToDatabase.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products");
    }

    for (const product of results) {
      const data = await ctx.runMutation(internal.products.storeProducts, {
        product,
      });
    }
    return "success";
  },
});
