import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    plugins: [ 
        vue()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@style": fileURLToPath(new URL("./style", import.meta.url))
        }
    },
    build: {
        target: "es2020",
        outDir: "./dist",
        emptyOutDir: true
    },
    esbuild: {
        charset: "utf8"
    },
    define: {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }
})
