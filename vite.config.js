import nodePath from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
    root: nodePath.join(import.meta.dirname, "src"),
    base: "/Minesweeper-Clone/",
    build: {
        outDir: nodePath.join(import.meta.dirname, "dist"),
        emptyOutDir: true,
    },
});