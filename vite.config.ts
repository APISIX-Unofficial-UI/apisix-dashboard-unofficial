import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const {
    VITE_ENABLE_VITE_PROXY,
    VITE_BASE_URL,
    VITE_APISIX_ADMIN_API_ENDPOINT,
    VITE_APISIX_ADMIN_API_PROXY_ENDPOINT,
    VITE_APISIX_CONTROL_API_ENDPOINT,
    VITE_APISIX_CONTROL_API_PROXY_ENDPOINT,
  } = loadEnv(mode, CWD);
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
      }),
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {},
              },
            },
            {
              name: 'prefixIds',
              params: {
                delim: '__',
                prefixIds: true,
                prefixClassNames: true,
              },
            },
          ],
        },
      }),
    ],

    server: {
      port: 3002,
      host: '0.0.0.0',
      // 项目是否启动请求代理
      proxy:
        VITE_ENABLE_VITE_PROXY === 'true'
          ? {
              // apisix admin
              [VITE_APISIX_ADMIN_API_PROXY_ENDPOINT]: {
                target: VITE_APISIX_ADMIN_API_ENDPOINT,
                rewrite: (path) => path.replace(new RegExp(`^${VITE_APISIX_ADMIN_API_PROXY_ENDPOINT}`), ''),
                secure: false,
              },
              // apisix control
              [VITE_APISIX_CONTROL_API_PROXY_ENDPOINT]: {
                target: VITE_APISIX_CONTROL_API_ENDPOINT,
                rewrite: (path) => path.replace(new RegExp(`^${VITE_APISIX_CONTROL_API_PROXY_ENDPOINT}`), ''),
                secure: false,
              },
            }
          : undefined,
    },
  };
};
