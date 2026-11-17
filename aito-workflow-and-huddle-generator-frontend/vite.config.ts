/*import {
  defineConfig,
} from "vite";

import react from "@vitejs/plugin-react";

import path from "node:path";

import {
  fileURLToPath,
} from "node:url";

const currentDirectory =
  path.dirname(
    fileURLToPath(import.meta.url),
  );

export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(
        currentDirectory,
        "./src",
      ),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
});
*/

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contentEditsDevPlugin } from "./vite/contentEditsDevPlugin.ts";

const currentDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Dev server only: saves suggested and confirmed AI tool edits to src/data (see the plugin).
    contentEditsDevPlugin(path.resolve(currentDirectory, "./src/data")),
  ],

  resolve: {
    alias: {
      "@": path.resolve(
        currentDirectory,
        "./src",
      ),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
});