import {
  AppIcon,
  Certificate1Icon,
  File1Icon,
  KeyIcon,
  ServerIcon,
  SitemapIcon,
  SystemRegulationIcon,
  UserSafetyIcon,
} from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import apisixSvg from '@/assets/apisix_svg.svg?component';
import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/apisix',
    component: Layout,
    redirect: '/apisix/route',
    name: 'apisix',
    meta: {
      flat: true,
      title: {
        zh_CN: 'APISIX',
        en_US: 'APISIX',
      },
      icon: shallowRef(apisixSvg),
      orderNo: 0,
    },
    children: [
      {
        path: 'route',
        name: 'ApisixRoute',
        component: () => import('@/pages/apisix/route/index.vue'),
        meta: {
          icon: shallowRef(SitemapIcon),
          title: {
            zh_CN: '路由',
            en_US: 'Route',
          },
        },
      },
      {
        path: 'route/edit',
        name: 'ApisixRouteEdit',
        component: () => import('@/pages/apisix/route/edit/index.vue'),
        meta: {
          title: {
            zh_CN: '编辑路由',
            en_US: 'Edit Route',
          },
          hidden: true,
        },
      },
      {
        path: 'upstream',
        name: 'ApisixUpstream',
        component: () => import('@/pages/apisix/upstream/index.vue'),
        meta: {
          icon: shallowRef(ServerIcon),
          title: {
            zh_CN: '上游',
            en_US: 'Upstream',
          },
        },
      },
      {
        path: 'upstream/edit',
        name: 'ApisixUpstreamEdit',
        component: () => import('@/pages/apisix/upstream/edit/index.vue'),
        meta: {
          title: {
            zh_CN: '编辑上游',
            en_US: 'Edit Upstream',
          },
          hidden: true,
        },
      },
      {
        path: 'service',
        name: 'ApisixService',
        component: () => import('@/pages/apisix/service/index.vue'),
        meta: {
          icon: shallowRef(AppIcon),
          title: {
            zh_CN: '服务',
            en_US: 'Service',
          },
        },
      },
      // {
      //   path: 'service/edit',
      //   name: 'ApisixServiceEdit',
      //   component: () => import('@/pages/apisix/service/edit/index.vue'),
      //   meta: {
      //     title: {
      //       zh_CN: '编辑服务',
      //       en_US: 'Edit Service',
      //     },
      //     hidden: true,
      //   },
      // },
      {
        path: 'consumer',
        name: 'ApisixConsumer',
        component: () => import('@/pages/apisix/consumer/index.vue'),
        meta: {
          icon: shallowRef(UserSafetyIcon),
          title: {
            zh_CN: '消费者',
            en_US: 'Consumer',
          },
        },
      },
      {
        path: 'consumer/edit',
        name: 'ApisixConsumerEdit',
        component: () => import('@/pages/apisix/consumer/edit/index.vue'),
        meta: {
          title: {
            zh_CN: '编辑消费者',
            en_US: 'Edit Consumer',
          },
          hidden: true,
        },
      },
      {
        path: 'proto',
        name: 'ApisixProto',
        component: () => import('@/pages/apisix/proto/index.vue'),
        meta: {
          icon: shallowRef(File1Icon),
          title: {
            zh_CN: 'Protocol Buffers',
            en_US: 'Protocol Buffers',
          },
        },
      },
      // {
      //   path: 'proto/edit',
      //   name: 'ApisixProtoEdit',
      //   component: () => import('@/pages/apisix/proto/edit/index.vue'),
      //   meta: {
      //     title: {
      //       zh_CN: '编辑 Proto',
      //       en_US: 'Edit Proto',
      //     },
      //     hidden: true,
      //   },
      // },
      {
        path: 'global_rule',
        name: 'ApisixGlobalRule',
        component: () => import('@/pages/apisix/global_rule/index.vue'),
        meta: {
          icon: shallowRef(SystemRegulationIcon),
          title: {
            zh_CN: '全局规则',
            en_US: 'Global Rule',
          },
        },
      },
      // {
      //   path: 'global_rule/edit',
      //   name: 'ApisixGlobalRuleEdit',
      //   component: () => import('@/pages/apisix/global_rule/edit/index.vue'),
      //   meta: {
      //     title: {
      //       zh_CN: '编辑规则',
      //       en_US: 'Edit Rule',
      //     },
      //     hidden: true,
      //   },
      // },
      {
        path: 'ssl',
        name: 'ApisixSsl',
        component: () => import('@/pages/apisix/ssl/index.vue'),
        meta: {
          icon: shallowRef(Certificate1Icon),
          title: {
            zh_CN: 'SSL',
            en_US: 'SSL',
          },
        },
      },
      // {
      //   path: 'ssl/edit',
      //   name: 'ApisixProtoEdit',
      //   component: () => import('@/pages/apisix/ssl/edit/index.vue'),
      //   meta: {
      //     title: {
      //       zh_CN: '编辑 SSL',
      //       en_US: 'Edit SSL',
      //     },
      //     hidden: true,
      //   },
      // },
      {
        path: 'secret',
        name: 'ApisixSecret',
        component: () => import('@/pages/apisix/secret/index.vue'),
        meta: {
          icon: shallowRef(KeyIcon),
          title: {
            zh_CN: '密钥管理器',
            en_US: 'SecretManager',
          },
        },
      },
      {
        path: 'secret/edit',
        name: 'ApisixSecretEdit',
        component: () => import('@/pages/apisix/secret/edit/index.vue'),
        meta: {
          title: {
            zh_CN: '编辑密钥管理器',
            en_US: 'Edit SecretManager',
          },
          hidden: true,
        },
      },
    ],
  },
];
