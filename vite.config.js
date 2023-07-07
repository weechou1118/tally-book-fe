import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import path from 'path'
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createStyleImportPlugin(
    {
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/css`
          }
        }
      ]
    }),
	  rollupPluginNodeResolve({extensions: ['.jsx', '.js']})
  ],
  css: {
    modules: {
      localsConvention: 'dashesOnly',
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'utils': path.resolve(__dirname, 'src/utils')
    },
    preserveSymlinks: true
  }
})
