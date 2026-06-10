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
