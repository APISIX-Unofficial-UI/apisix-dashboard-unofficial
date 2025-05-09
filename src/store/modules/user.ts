import { defineStore } from 'pinia';

import { PluginApi } from '@/api/apisix/admin';
import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

type UserStore = {
  adminEndpoint: string | null;
  adminKey: string | null;
  ctrlEndpoint: string | null;
  ctrlKey: string | null;
  userInfo: UserInfo | null; // 用户信息 存在视为已登录状态
  keepLogin: boolean;
  loginAt: number | null; // 毫秒Unix时间戳
  sessionTimer: ReturnType<typeof setInterval> | null;
};

export type LoginOptions = {
  ctrlEndpoint?: string;
  ctrlKey?: string;
  keepLogin?: boolean;
};

/**
 * 检查会话过期
 * @param storeCtx
 * @returns
 */
const checkSession = (storeCtx: ReturnType<typeof useUserStore>) => {
  return () => {
    // 10 minutes
    if (new Date().getTime() - storeCtx.loginAt > 10 * 60 * 1000) {
      clearInterval(storeCtx.sessionTimer);
      storeCtx.logout();
    }
  };
};

export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    adminEndpoint: null,
    adminKey: null,
    ctrlEndpoint: null,
    ctrlKey: null,
    userInfo: null,
    keepLogin: false,
    loginAt: null,
    sessionTimer: null,
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    /**
     * 登录
     * @param adminEndpoint
     * @param adminKey
     * @param ctrlEndpoint
     * @param ctrlKey
     * @param keepLogin 保持登录状态，否则10分钟过期自动登出
     */
    async login(adminEndpoint: string, adminKey: string, opts?: LoginOptions) {
      this.adminEndpoint = adminEndpoint;
      this.adminKey = adminKey;
      this.ctrlEndpoint = opts?.ctrlEndpoint;
      this.ctrlKey = opts?.ctrlKey;
      this.keepLogin = opts?.keepLogin || false;

      // 检查key有效性
      try {
        await PluginApi.apisixAdminPluginsListGet();
      } catch (e) {
        throw new Error(`Admin Key无效`, { cause: e });
      }

      this.loginAt = new Date().getTime();
      if (!this.keepLogin) {
        this.sessionTimer = setInterval(checkSession(this), 1000);
      }
    },
    /**
     * 获取用户信息
     */
    async getUserInfo() {
      if (this.userInfo !== null) {
        return;
      }

      // 检查key有效性
      try {
        await PluginApi.apisixAdminPluginsListGet();
      } catch (e) {
        throw new Error(`Admin Key无效`, { cause: e });
      }

      this.userInfo = {
        name: 'admin',
        roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      };

      // 根据用户权限初始化路由
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes(this.userInfo.roles);
    },
    /**
     * 退出登录
     */
    async logout() {
      if (this.sessionTimer != null) {
        clearInterval(this.sessionTimer);
      }

      this.$reset();

      // 重置路由
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes([]);
    },
  },
  persist: {
    storage: sessionStorage,
    afterRestore: (ctx) => {
      // userInfo存在视为已登录状态
      if (ctx.store.$state.userInfo != null) {
        // 刷新页面后需要重设timer
        if (!ctx.store.$state.keepLogin) {
          ctx.store.$state.sessionTimer = setInterval(checkSession(ctx.store as ReturnType<typeof useUserStore>), 1000);
        }

        // 根据用户权限初始化路由
        const permissionStore = usePermissionStore();
        permissionStore.initRoutes(ctx.store.$state.userInfo.roles);
      }
    },
    key: 'user',
    paths: [
      'adminEndpoint',
      'adminKey',
      'ctrlEndpoint',
      'ctrlKey',
      'userInfo',
      'keepLogin',
      'loginAt',
      // 'sessionTimer',
    ],
  },
});
