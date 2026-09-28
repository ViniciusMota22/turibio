import { defineConfig } from "vite";
export default defineConfig({
  // No build SSR, empacota tudo (inclusive CSS de fontes) para o Node conseguir importar.
  ssr: { noExternal: true },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Client-only Vite build: React Server Component directives in dependencies do not apply.
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        warn(warning);
      },
    },
  },
});
