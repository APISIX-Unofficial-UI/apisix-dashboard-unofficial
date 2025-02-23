export interface ImportMetaEnv {
  // 部署路径
  readonly VITE_BASE_URL: string;
  // 开启Vite代理
  readonly VITE_ENABLE_VITE_PROXY: string;

  // Apisix Admin API
  readonly VITE_APISIX_ADMIN_API_ENDPOINT: string;
  // Apisix Admin API Vite 代理挂载路径
  readonly VITE_APISIX_ADMIN_API_PROXY_ENDPOINT: string;

  // Apisix Control API
  readonly VITE_APISIX_CONTROL_API_ENDPOINT: string;
  // Apisix Control API Vite 代理挂载路径
  readonly VITE_APISIX_CONTROL_API_PROXY_ENDPOINT: string;
}
