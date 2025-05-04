export interface ImportMetaEnv {
  // 部署路径
  readonly VITE_BASE_URL: string;
  // 开启Vite代理
  readonly VITE_ENABLE_VITE_PROXY: string;

  // Apisix Admin API
  readonly VITE_ADMIN_API_ENDPOINT_PRESET: string;
  readonly VITE_ADMIN_API_KEY_PRESET: string;
  readonly VITE_ADMIN_API_PROXY_TARGET: string;
  // Apisix Control API
  readonly VITE_CTRL_API_ENDPOINT_PRESET: string;
  readonly VITE_CTRL_API_KEY_PRESET: string;
  readonly VITE_CTRL_API_PROXY_TARGET: string;
}
