import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

const isLib = process.env.BUILD_LIB === 'true'

// Single config for both modes:
//   npm run build      → SPA/playground (Vercel)
//   npm run build:lib  → npm library package
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    react(),
    // dts is loaded dynamically so its import never runs during `dev`
    // (static import of vite-plugin-dts hangs the process at startup)
    isLib && command === 'build' && import('vite-plugin-dts').then(m =>
      m.default({
        include: ['src/components', 'src/lib', 'src/index.ts'],
        tsconfigPath: './tsconfig.lib.json',
      })
    ),
  ],
  ...(isLib ? {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ConvergeDS',
        fileName: 'converge-ds',
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime',
          },
        },
      },
      cssCodeSplit: false,
    },
  } : {}),
}))
