// constants.ts
import merge from 'lodash/merge';
import { FormRule } from 'tdesign-vue-next';

import { t } from '@/locales';

// 基础验证规则
export const FORM_RULES_1: Record<string, FormRule[]> = {
  uri: [
    {
      required: true,
      message: t('pages.apisixRouteEdit.validation.uriRequired'),
      type: 'error',
    },
  ],
  'proxyRewrite.uri': [
    {
      required: true,
      message: t('pages.apisixRouteEdit.validation.proxyRewrite.staticUriRequired'),
      type: 'error',
      trigger: 'blur',
    },
  ],
  'proxyRewrite.regexMatch': [
    {
      required: true,
      message: t('pages.apisixRouteEdit.validation.proxyRewrite.regexMatchRequired'),
      type: 'error',
      trigger: 'blur',
    },
  ],
  'proxyRewrite.regexTemplate': [
    {
      required: true,
      message: t('pages.apisixRouteEdit.validation.proxyRewrite.regexTemplateRequired'),
      type: 'error',
      trigger: 'blur',
    },
  ],
  'proxyRewrite.host': [
    {
      required: true,
      message: t('pages.apisixRouteEdit.validation.proxyRewrite.hostRequired'),
      type: 'error',
      trigger: 'blur',
    },
  ],
};

export const FORM_RULES_2: Record<string, FormRule[]> = merge({}, FORM_RULES_1, {});
export const FORM_RULES_3: Record<string, FormRule[]> = merge({}, FORM_RULES_1, {});

export const METHOD_OPTIONS = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTIONS', value: 'OPTIONS' },
  { label: 'CONNECT', value: 'CONNECT' },
  { label: 'TRACE', value: 'TRACE' },
  { label: 'PURGE', value: 'PURGE' },
];
