import { v } from "convex/values";
import { action } from "./_generated/server";

// Very light-weight HTML metadata extraction. Not bullet-proof but works for common ecommerce pages.
export const productMetadata = action({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const { url } = args;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; YallaWishBot/1.0)" } });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const html = await res.text();

      // Helper to extract first capture group
      const pick = (re: RegExp) => {
        const m = html.match(re);
        return m?.[1]?.trim();
      };

      // Title strategies
      const title =
        pick(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        pick(/<meta[^>]+name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i) ||
        pick(/<title>([^<]+)<\/title>/i) || null;

      // Price heuristics (very naive)
      const priceCandidates: string[] = [];
      const priceRegexes = [
        /"price"\s*:\s*"?([0-9]+(?:[.,][0-9]{2})?)"?/i,
        /<meta[^>]+property=["']product:price:amount["'][^>]*content=["']([^"']+)["']/i,
        /<span[^>]*class=["'][^"']*(price|Price)[^"']*["'][^>]*>\s*([$€£A-Z]{0,3}\s?[0-9]+[0-9.,]*)/i,
      ];
      for (const r of priceRegexes) {
        const m = html.match(r);
        if (m?.[1]) priceCandidates.push(m[1]);
      }
      const price = priceCandidates[0] || null;

      // Image
      const image =
        pick(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        pick(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) || null;

      return { ok: true, title, price, image };
    } catch (e: any) {
      console.error("scrape error", e);
      return { ok: false, error: e.message };
    }
  },
});
