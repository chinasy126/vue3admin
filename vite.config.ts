import { UserConfig, ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: false , // 运行自动打开浏览器 true
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_TARGET,
          changeOrigin: true,
          rewrite: path =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        },

        [env.VITE_APP_UPLOAD_PREFIX_API] : {
          target: env.VITE_APP_UPLOAD_URL, // 图片访问转换地址
          changeOrigin: true,
          rewrite: path =>
            path.replace(new RegExp('^' + env.VITE_APP_UPLOAD_PREFIX_API), '')
        }

      }
    },
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve('./src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    }
  };
};
