import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./", import.meta.url)),
        },
    },
    test: {
        environment: "node",
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'], // Generates terminal output and an HTML report
          },
    },
});
