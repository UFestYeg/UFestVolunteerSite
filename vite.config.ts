/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/",
    plugins: [react()],
    server: {
        // Bind to 127.0.0.1 (not the default localhost) so the SPA shares a
        // host with the API/admin (ROOT_URL defaults to 127.0.0.1:8000). The
        // browser treats localhost and 127.0.0.1 as different sites, which
        // withholds the SameSite=Lax session cookie on cross-site XHR and
        // breaks frontend<->admin session sharing/logout in dev.
        host: "127.0.0.1",
        port: 3000,
    },
    build: {
        outDir: "build",
        // Emit JS/CSS/asset chunks into build/static (not the Vite default
        // build/assets). Django serves static only under STATIC_URL=/static/
        // (STATICFILES_DIRS includes build/static), so with base "/" the bundle
        // is referenced as /static/<hash>.js and collectstatic/WhiteNoise can
        // actually serve it. Without this the app loads from /assets/... which
        // 404s into the SPA catch-all and the page renders blank.
        assetsDir: "static",
        // The `mui` chunk (@mui/material core + @emotion) is ~790 kB minified
        // (~240 kB gzip) and can't be split further in any useful way — its
        // modules are deeply interdependent. Everything else that can be split
        // already is (vendor, mui-icons, and the lazy calendar route chunks),
        // so raise the limit above the MUI core size to silence the noise while
        // still catching genuinely new oversized chunks.
        chunkSizeWarningLimit: 850,
        rollupOptions: {
            output: {
                // Split the always-loaded dependencies out of the app bundle so
                // they cache independently of our code. react-big-calendar is
                // deliberately left out (returns undefined) so it stays in the
                // lazily-loaded calendar route chunks instead of being pulled
                // back into an eager vendor chunk.
                manualChunks(id) {
                    if (!id.includes("node_modules")) {
                        return;
                    }
                    if (id.includes("react-big-calendar")) {
                        return;
                    }
                    if (id.includes("@mui/icons-material")) {
                        return "mui-icons";
                    }
                    if (id.includes("@mui") || id.includes("@emotion")) {
                        return "mui";
                    }
                    return "vendor";
                },
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/setupTests.ts"],
        css: true,
        server: {
            deps: {
                // Inline so each `import * as Moment` gets its own interop
                // namespace (matching the webpack/CRA behaviour); otherwise the
                // shared singleton makes moment-range's extendMoment throw
                // "Cannot redefine property: range" on the second call.
                inline: ["moment", "moment-range"],
            },
        },
        coverage: {
            provider: "v8",
        },
    },
});
