import uniq from 'lodash/uniq';
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

// --- START: 添加测试 Harness 路由 ---
const harnessRoute: RouteRecordRaw = {
  // 定义一个清晰的、不易冲突的路径
  path: '/dev/upstream-form-harness',
  name: 'UpstreamFormHarness',
  component: () => import('@/components/upstream/upstream-form-harness.vue'), // 确认路径正确
  meta: {
    title: 'Upstream表单测试工具', // 可选：设置页面标题
    requiresAuth: false, // 可选：通常测试页面不需要登录
    // layout: 'blank', // 可选：如果你的布局系统支持，可以指定一个空白或特殊的布局
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

/**
 *
 * @deprecated 未使用
 */
export const getRoutesExpanded = () => {
  const expandedRoutes: Array<string> = [];

  fixedRouterList.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child: RouteRecordRaw) => {
          expandedRoutes.push(item.path);
          expandedRoutes.push(`${item.path}/${child.path}`);
        });
    }
  });
  return uniq(expandedRoutes);
};

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
