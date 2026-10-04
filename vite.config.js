import { defineConfig } from "vite";

// The worlds are plain HTML pages in public/worlds. Vercel serves
// /worlds/world-1 through cleanUrls; the dev and preview servers need the
// directory index spelled out.
function worldsIndex() {
  const rewrite = (req, _res, next) => {
    const [path, query] = req.url.split("?");
    if (/^\/worlds(\/world-[1-6])?\/?$/.test(path)) {
      req.url =
        path.replace(/\/?$/, "/index.html") + (query ? `?${query}` : "");
    }
    next();
  };

  return {
    name: "worlds-index",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  plugins: [worldsIndex()],
});
