import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import environment from "vite-plugin-environment";

// Using dynamic import for ESM module
const config = async () => {
  const { default: pluginRewriteAll } = await import("vite-plugin-rewrite-all");

  return defineConfig({
    plugins: [
      react(),
      tsconfigPaths(),
      pluginRewriteAll(),
      environment("all", { prefix: "REACT_APP_" }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-router-dom", "react-dom"],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@hashgraph/asset-tokenization-sdk/port/out': '@hashgraph/asset-tokenization-sdk/build/esm/src/port/out',
        '@hashgraph/asset-tokenization-sdk/port': '@hashgraph/asset-tokenization-sdk/build/esm/src/port'
      }
    },
  });
};

export default config;
