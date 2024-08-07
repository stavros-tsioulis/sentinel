/// <reference types="vitest" />
import { defineConfig } from "vite";
import { coverageConfigDefaults } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/**/*.spec.ts", "src/**/*.spec.d.ts"],
		coverage: {
			provider: "v8",
			exclude: [...coverageConfigDefaults.exclude]
		},
	},
});
