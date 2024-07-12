import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    hmr: true,
    port: 3002,
    proxy: {
      "/api": {
        target: "http://localhost:9092/",
        changeOrigin: true,
        pathRewrite: {
          "^api": "/api",
        },
      },
    },
  },
});
