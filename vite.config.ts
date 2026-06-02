/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/",
    plugins: [react()],
    server: {
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
