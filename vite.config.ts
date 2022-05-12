import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoComponentImport from 'unplugin-auto-import/vite';
import DefineOptions from 'unplugin-vue-define-options/vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  plugins: [
    vue(),
    DefineOptions(),
    AutoComponentImport({
      imports: [
        'vue',
        'vue-router',
        'vuex',
        {
          '[package_name]': ['[import_names]', ['[from]', '[alias]']],
        }
      ],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.vue', '.ts']
  },
  
});
