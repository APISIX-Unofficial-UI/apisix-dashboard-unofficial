import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_ENABLE_VITE_PROXY, VITE_BASE_URL, VITE_ADMIN_API_PROXY_TARGET, VITE_CTRL_API_PROXY_TARGET } = loadEnv(
    mode,
    CWD,
  );
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
              '/vite-proxy/apisix-admin/': {
                target: VITE_ADMIN_API_PROXY_TARGET,
                rewrite: (path) => path.replace(/^\/vite-proxy\/apisix-admin\//, ''),
                secure: false,
              },
              // apisix control
              '/vite-proxy/apisix-control/': {
                target: VITE_CTRL_API_PROXY_TARGET,
                rewrite: (path) => path.replace(/^\/vite-proxy\/apisix-control\//, ''),
                secure: false,
              },
            }
          : undefined,
    },
  };
};
