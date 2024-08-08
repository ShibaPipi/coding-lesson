import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11']
        }),
        react()
    ],
    base: './',
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
