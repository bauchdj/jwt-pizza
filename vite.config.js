import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
	build: { sourcemap: true },
	plugins: [
		istanbul({
			include: ["src/**/*"],
			exclude: ["node_modules"],
			requireEnv: false,
		}),
		tailwindcss(),
	],
});
