import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

// 导入modules非homepage相关固定路由
const fixedModules = import.meta.glob('./modules/**/*.ts', { eager: true });

// 其他固定路由
const defaultRouterList: Array<RouteRecordRaw> = [
  {
    path: '//login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '//',
    redirect: '/apisix',
  },
];
// 存放固定路由
export const fixedRouterList: Array<RouteRecordRaw> = mapModuleRouterList(fixedModules);

// Harness 路由
const harnessRoute: RouteRecordRaw = {
  path: '/dev/upstream-form-harness',
  name: 'UpstreamFormHarness',
  component: () => import('@/components/upstream/upstream-form-harness.vue'),
  meta: {
    title: 'UpstreamForm Harness',
    requiresAuth: false,
  },
};

const devRoutes: Array<RouteRecordRaw> = [];

// 仅在开发模式下添加 Harness 路由
if (import.meta.env.DEV) {
  devRoutes.push(harnessRoute);
  console.log('[Router] Added development route:', harnessRoute.path); // 方便调试时确认
}

export const allRoutes = [...fixedRouterList, ...defaultRouterList, ...devRoutes];

// 固定路由模块转换为路由
export function mapModuleRouterList(modules: Record<string, unknown>): Array<RouteRecordRaw> {
  const routerList: Array<RouteRecordRaw> = [];
  Object.keys(modules).forEach((key) => {
    // @ts-ignore
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routerList.push(...modList);
  });
  return routerList;
}

export const getActive = (maxLevel = 3): string => {
  // 非组件内调用必须通过Router实例获取当前路由
  // 确保 router 实例在使用前已创建
  if (!router) {
    console.warn('[Router] getActive called before router instance is created.');
    return '';
  }
  const route = router.currentRoute.value;

  if (!route.path) {
    return '';
  }

  return route.path
    .split('/')
    .filter((_item: string, index: number) => index <= maxLevel && index > 0)
    .map((item: string) => `/${item}`)
    .join('');
};

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;
