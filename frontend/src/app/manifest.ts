import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SmartCart",
    short_name: "SmartCart",
    description: "Minimalist, AI-powered shopping companion.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f7",
    theme_color: "#0f0f10",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
