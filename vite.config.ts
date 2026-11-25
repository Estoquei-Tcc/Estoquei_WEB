import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    envPrefix: "VITE_PUBLIC_FIREBASE_",
});
