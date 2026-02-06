import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express } from "express";
import { widgetsDevServer } from "skybridge/server";
import type { ViteDevServer } from "vite";
import { mcp } from "./middleware.js";
import server from "./server.js";

const app = express() as Express & { vite: ViteDevServer };

app.use(express.json());

// Image proxy endpoint path constant
const IMAGE_PROXY_PATH = "/api/image-proxy";

// Add image proxy endpoint to handle CORS and authentication issues
app.get(IMAGE_PROXY_PATH, async (req, res) => {
  try {
    const { url } = req.query;

    console.log(`🔄 IMAGE PROXY REQUEST RECEIVED`);
    console.log(`📥 Query URL parameter:`, url);
    console.log(`🌐 Full request URL:`, req.url);
    console.log(`🔗 Referer:`, req.headers.referer);
    console.log(`👤 User-Agent:`, req.headers["user-agent"]);

    if (!url || typeof url !== "string") {
      console.log(`❌ Image proxy: Missing URL parameter`);
      return res.status(400).json({ error: "Image URL is required" });
    }

    console.log(
      `🖼️ Image proxy request from: ${req.headers["user-agent"] || "Unknown"}`,
    );
    console.log(`🖼️ Proxying image: ${url}`);
    console.log(`🔗 Referer: ${req.headers.referer || "No referer"}`);
    console.log(`🌐 Origin: ${req.headers.origin || "No origin"}`);

    // Fetch the image with proper headers
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        // Add basic auth if the image is from Michelin domain
        // ...(url.includes("michelin.fr")
        //   ? {
        //       Authorization:"",
        //     }
        //   : {}),
      },
      // Set a timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(
        `❌ Image fetch failed: ${response.status} ${response.statusText}`,
      );
      return res.status(response.status).json({
        error: `Failed to fetch image: ${response.status} ${response.statusText}`,
      });
    }

    // Get the content type
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Set appropriate headers with enhanced CORS support
    res.set({
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Max-Age": "86400",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "X-Content-Type-Options": "nosniff",
    });

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Pipe the image response
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error(
      "❌ Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    res.status(500).json({
      error: "Failed to proxy image",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Simple placeholder endpoint for fallback images
app.get("/api/placeholder/:width/:height", (req, res) => {
  const { width, height } = req.params;
  const w = parseInt(width) || 300;
  const h = parseInt(height) || 300;

  // Generate a simple SVG placeholder
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f1f5f9"/>
    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">No Image</text>
  </svg>`;

  res.set({
    "Content-Type": "image/svg+xml",
    "Cache-Control": "public, max-age=3600",
    "Access-Control-Allow-Origin": "*",
  });

  res.send(svg);
});

// Add OPTIONS handler for preflight requests
app.options(IMAGE_PROXY_PATH, (req, res) => {
  console.log(
    `🔄 Image proxy preflight request from: ${req.headers.origin || "Unknown"}`,
  );
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": "86400",
  });
  res.status(200).end();
});

app.use(mcp(server));

const env = process.env.NODE_ENV || "development";

if (env !== "production") {
  const { devtoolsStaticServer } = await import("@skybridge/devtools");
  app.use(await devtoolsStaticServer());
  app.use(await widgetsDevServer());
}

if (env === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use("/assets", cors());
  app.use("/assets", express.static(path.join(__dirname, "assets")));
}

app.listen(3000, (error) => {
  if (error) {
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  process.exit(0);
});
