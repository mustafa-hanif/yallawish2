import { v } from "convex/values";
import { action } from "./_generated/server";

// Very light-weight HTML metadata extraction. Not bullet-proof but works for common ecommerce pages.
export const productMetadata = action({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const { url } = args;
    
    console.log("Scraping URL:", url);
    
    // Check if it's an Amazon URL - use special handling
    const isAmazon = /amazon\.(com|co\.uk|de|fr|it|es|ca|com\.au|ae|sa)/i.test(url);
    
    // Extract ASIN from Amazon URL for fallback image
    let asin: string | null = null;
    if (isAmazon) {
      const asinMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        asin = asinMatch[1].toUpperCase();
        console.log("Extracted ASIN:", asin);
      }
    }
    
    try {
      // Fetch the page with different headers
      const res = await fetch(url, {
        headers: {
          "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      });
      
      console.log("Fetch response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
      }
      
      const html = await res.text();
      console.log("HTML length:", html.length);
      
      // Debug: Log first 500 chars to see what we're getting
      console.log("HTML preview:", html.substring(0, 500));

      let title: string | null = null;
      let price: string | null = null;
      let image: string | null = null;

      // Try og:image first - works for most sites including Amazon when using Facebook UA
      const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      if (ogImageMatch && ogImageMatch[1]) {
        image = ogImageMatch[1];
        console.log("Found og:image:", image);
      }

      // Try og:title
      const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        title = ogTitleMatch[1];
        console.log("Found og:title:", title);
      }

      // Fallback title from <title> tag
      if (!title) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }
      }

      if (isAmazon) {
        // Amazon-specific image patterns if og:image didn't work
        if (!image) {
          // Try hiRes from colorImages JSON
          const hiResMatch = html.match(/"hiRes"\s*:\s*"(https:[^"]+)"/);
          if (hiResMatch && hiResMatch[1]) {
            image = hiResMatch[1].replace(/\\u002F/g, '/').replace(/\\/g, '');
            console.log("Found hiRes:", image);
          }
        }
        
        if (!image) {
          // Try large from colorImages JSON  
          const largeMatch = html.match(/"large"\s*:\s*"(https:[^"]+)"/);
          if (largeMatch && largeMatch[1]) {
            image = largeMatch[1].replace(/\\u002F/g, '/').replace(/\\/g, '');
            console.log("Found large:", image);
          }
        }

        if (!image) {
          // Try any amazon image URL
          const anyImg = html.match(/"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
          if (anyImg && anyImg[1]) {
            image = anyImg[1].replace(/\\u002F/g, '/').replace(/\\/g, '');
            console.log("Found any amazon img:", image);
          }
        }

        // Price extraction for Amazon
        const pricePatterns = [
          /"priceAmount"\s*:\s*"?([0-9.]+)"?/,
          /<span[^>]*class=["'][^"']*a-price-whole["'][^>]*>([0-9,]+)/i,
          /<span[^>]*class=["'][^"']*a-offscreen["'][^>]*>\$?([0-9.,]+)/i,
        ];
        for (const pattern of pricePatterns) {
          const match = html.match(pattern);
          if (match && match[1]) {
            price = match[1].trim().replace(/,/g, '');
            break;
          }
        }
      } else {
        // Non-Amazon price extraction
        const priceMatch = html.match(/"price"\s*:\s*"?([0-9]+(?:[.,][0-9]{2})?)"?/i);
        if (priceMatch && priceMatch[1]) {
          price = priceMatch[1];
        }
      }

      // Decode HTML entities
      if (image) {
        image = image.replace(/&amp;/g, '&');
      }

      console.log("Final result:", { title: title?.substring(0, 50), price, image: image?.substring(0, 100) });

      return { ok: true, title, price, image };
      
    } catch (e: any) {
      console.error("scrape error:", e.message);
      return { ok: false, error: e.message };
    }
  },
});
