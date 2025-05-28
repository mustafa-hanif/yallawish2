import { createDirectus, rest } from "@directus/sdk";

const directus = createDirectus("https://yalla-wish.directus.app/").with(
  rest()
);

export default directus;
