import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    // Netlify serves from the domain root. GitHub project Pages uses the repository path.
    base: process.env.GITHUB_PAGES === "true" ? "/TCC_Estoquei/" : "/",
});
