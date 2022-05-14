import { defineConfig, normalizePath } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoComponentImport from 'unplugin-auto-import/vite';
import DefineOptions from 'unplugin-vue-define-options/vite';
import viteEslint from 'vite-plugin-eslint';
import VueJsx from '@vitejs/plugin-vue-jsx';

// 由于 Windows 识别多个路径分隔符，两个分隔符都将被 Windows 首选分隔符 (\) 的实例替换
// 解决 window 下的路径问题
const mixinsCssPath = normalizePath(
  path.resolve(__dirname, 'src/styles/mixin.scss')
);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2020',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
  root: path.resolve(__dirname, 'src'),
  plugins: [
    vue(),
    VueJsx(),
    DefineOptions(),
    AutoComponentImport({
      imports: [
        'vue',
        'vue-router',
        'vuex',
        {
          '[package_name]': ['[import_names]', ['[from]', '[alias]']],
        },
      ],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: false, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
    viteEslint(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.vue', '.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      // 开启 camelCase 格式变量名转换
      localsConvention: 'camelCase',
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名 hash表示哈
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        // additionalData: 以lang="scss"的样式文件会自动引入对应的文件
        additionalData: `@use "${mixinsCssPath}" as *;`,
      },
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
});
