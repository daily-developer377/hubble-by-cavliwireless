import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components (default in new Next 16 apps) requires every Server
  // Component that reads dynamic data to be wrapped in Suspense or use
  // explicit cache directives. This project reads live DB state (exhibitor
  // counts, product catalog) in several places, so the previous, simpler
  // dynamic-rendering model is used instead.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
