import { defineConfig } from  "tsup";

export default defineConfig({
    entry: ['src/index.ts'], // Your entry point
    format: ['esm'],         // Output as ESM (mjs/js)
    dts: false,              // Don't generate type files for prod
    splitting: false,        // Keep it simple
    sourcemap: true,         // Good for debugging production errors
    clean: true,             // Clean dist folder before build
    target: 'node20',        // Target your Node version
});
