import fs from "node:fs/promises";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, "src/pages");

try {
  const files = await fs.readdir(pagesDir);

  files.forEach((file) => {
    if (path.extname(file) === ".mdx") {
      const routePath =
        file === "root.mdx" ? "/" : `/${path.basename(file, ".mdx")}`;

      const filePath = path.join(pagesDir, file);

      app.use(routePath, async (req, res) => {
        try {
          const url = req.originalUrl.replace(base, "");

          /** @type {string} */
          let template;

          /** @type {import('./src/entry-server.ts').render} */
          let render;

          if (!isProduction) {
            // // Always read fresh template in development
            template = await fs.readFile("./index.html", "utf-8");
            template = await vite.transformIndexHtml(url, template);

            render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
          } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
          }

          const rendered = await render(filePath);

          const html = template
            .replace(`<!--app-head-->`, rendered.head ?? "")
            .replace(`<!--app-html-->`, rendered.html ?? "");

          res.status(200).set({ "Content-Type": "text/html" }).send(html);
        } catch (e) {
          vite?.ssrFixStacktrace(e);
          console.log(e.stack);
          res.status;
        }
      });

      console.log(`Route mapped: [${routePath}] -> [${file}]`);
    }
  });
} catch (e) {
  vite?.ssrFixStacktrace(e);
  console.log(e.stack);
  res.status(500).end(e.stack);
}

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
