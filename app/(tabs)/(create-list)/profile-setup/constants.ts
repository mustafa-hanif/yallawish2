export type PersonaChoice = "giftee" | "gifter" | "both";

export const GENDER_OPTIONS = ["Female", "Male"];

export const PERSONA_OPTIONS: {
  id: PersonaChoice;
  title: string;
  description: string;
}[] = [
  {
    id: "giftee",
    title: "I'm creating my wishlists",
    description: "Plan events, add gifts, and share lists so friends know what to buy.",
  },
  {
    id: "gifter",
    title: "I'm shopping for others",
    description: "Claim gifts from shared lists and keep purchases organised.",
  },
  {
    id: "both",
    title: "I do a bit of both",
    description: "Swap between making lists for yourself and buying for loved ones.",
  },
];

export const OCCASION_OPTIONS = ["Birthday", "Anniversary", "Baby shower", "Wedding", "Graduation", "Holiday gifting"];

export const GIFT_INTEREST_OPTIONS = ["Tech & Gadgets", "Home & Living", "Fashion & Accessories", "Beauty & Wellness", "Experiences", "Books & Stationery", "Kids & Family", "Food & Gourmet"];

export const SHOPPING_STYLE_OPTIONS = ["I love curated picks", "Show me trending now", "Let me browse everything"];

export const BUDGET_RANGE_OPTIONS = ["Under AED 150", "AED 150 – 350", "AED 350 – 750", "AED 750+"];

export const DISCOVERY_CHANNEL_OPTIONS = ["Instagram", "TikTok", "Pinterest", "YouTube", "Newsletters", "Friends & family", "In-store browsing"];

export const STORE_SUGGESTIONS = ["Amazon.ae", "Namshi", "Bloomingdale's", "Level Shoes", "Pottery Barn", "Crate & Barrel", "Ounass", "Virgin Megastore"];

export const SECONDARY_PURPLE = "#4B0082";
