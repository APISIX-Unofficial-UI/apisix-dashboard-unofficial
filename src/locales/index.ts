import { useLocalStorage, usePreferredLanguages } from '@vueuse/core';
import { DropdownOption } from 'tdesign-vue-next';
import { computed } from 'vue';
import { createI18n } from 'vue-i18n';

// 导入语言文件
const langModules = import.meta.glob('./lang/*/index.ts', { eager: true });

const langModuleMap = new Map<string, Object>();

export const langCode: Array<string> = [];

export const localeConfigKey = 'apisix-dashboard-unofficial-locale';

// 获取浏览器默认语言环境
const languages = usePreferredLanguages();

// 生成语言模块列表
const generateLangModuleMap = () => {
  const fullPaths = Object.keys(langModules);
  fullPaths.forEach((fullPath) => {
    const k = fullPath.replace('./lang', '');
    const startIndex = 1;
    const lastIndex = k.lastIndexOf('/');
    const code = k.substring(startIndex, lastIndex);
    langCode.push(code);
    langModuleMap.set(code, langModules[fullPath]);
  });
};

// 导出 Message
const importMessages = computed(() => {
  generateLangModuleMap();

  const message: Recordable = {};
  langModuleMap.forEach((value: any, key) => {
    message[key] = value.default;
  });
  return message;
});

export const i18n = createI18n({
  legacy: false,
  locale: useLocalStorage(localeConfigKey, 'zh_CN').value || languages.value[0] || 'zh_CN',
  fallbackLocale: 'zh_CN',
  messages: importMessages.value,
  globalInjection: true,
});

export const langList = computed(() => {
  if (langModuleMap.size === 0) generateLangModuleMap();

  const list: DropdownOption[] = [];
  langModuleMap.forEach((value: any, key) => {
    list.push({
      content: value.default.lang,
      value: key,
    });
  });

  return list;
});

// @ts-ignore
export const { t } = i18n.global;

export default i18n;

// #region 初始化 dayjs i18n

// NOTE: 无法实现循环批量导入
// import Locales from 'dayjs/locale.json';
// Locales.forEach((locale) => {
//   console.debug('加载 dayjs i18n 语言', locale);
//   // eslint-disable-next-line import/no-dynamic-require, global-require
//   import(/* @vite-ignore */ `../../node_modules/dayjs/locale/${locale.key}.js`);
// });

import 'dayjs/locale/af';
import 'dayjs/locale/am';
import 'dayjs/locale/ar-dz';
import 'dayjs/locale/ar-iq';
import 'dayjs/locale/ar-kw';
import 'dayjs/locale/ar-ly';
import 'dayjs/locale/ar-ma';
import 'dayjs/locale/ar-sa';
import 'dayjs/locale/ar-tn';
import 'dayjs/locale/ar';
import 'dayjs/locale/az';
import 'dayjs/locale/be';
import 'dayjs/locale/bg';
import 'dayjs/locale/bi';
import 'dayjs/locale/bm';
import 'dayjs/locale/bn-bd';
import 'dayjs/locale/bn';
import 'dayjs/locale/bo';
import 'dayjs/locale/br';
import 'dayjs/locale/bs';
import 'dayjs/locale/ca';
import 'dayjs/locale/cs';
import 'dayjs/locale/cv';
import 'dayjs/locale/cy';
import 'dayjs/locale/de-at';
import 'dayjs/locale/da';
import 'dayjs/locale/de-ch';
import 'dayjs/locale/de';
import 'dayjs/locale/dv';
import 'dayjs/locale/el';
import 'dayjs/locale/en-au';
import 'dayjs/locale/en-ca';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/en-ie';
import 'dayjs/locale/en-il';
import 'dayjs/locale/en-in';
import 'dayjs/locale/en-nz';
import 'dayjs/locale/en-sg';
import 'dayjs/locale/en-tt';
import 'dayjs/locale/eo';
import 'dayjs/locale/en';
import 'dayjs/locale/es-do';
import 'dayjs/locale/es-mx';
import 'dayjs/locale/es-pr';
import 'dayjs/locale/es-us';
import 'dayjs/locale/et';
import 'dayjs/locale/es';
import 'dayjs/locale/eu';
import 'dayjs/locale/fa';
import 'dayjs/locale/fo';
import 'dayjs/locale/fi';
import 'dayjs/locale/fr-ca';
import 'dayjs/locale/fr-ch';
import 'dayjs/locale/fr';
import 'dayjs/locale/fy';
import 'dayjs/locale/ga';
import 'dayjs/locale/gd';
import 'dayjs/locale/gom-latn';
import 'dayjs/locale/gl';
import 'dayjs/locale/gu';
import 'dayjs/locale/he';
import 'dayjs/locale/hi';
import 'dayjs/locale/hr';
import 'dayjs/locale/hu';
import 'dayjs/locale/ht';
import 'dayjs/locale/hy-am';
import 'dayjs/locale/id';
import 'dayjs/locale/is';
import 'dayjs/locale/it-ch';
import 'dayjs/locale/it';
import 'dayjs/locale/ja';
import 'dayjs/locale/jv';
import 'dayjs/locale/ka';
import 'dayjs/locale/kk';
import 'dayjs/locale/km';
import 'dayjs/locale/kn';
import 'dayjs/locale/ko';
import 'dayjs/locale/ku';
import 'dayjs/locale/ky';
import 'dayjs/locale/lb';
import 'dayjs/locale/lo';
import 'dayjs/locale/lt';
import 'dayjs/locale/lv';
import 'dayjs/locale/me';
import 'dayjs/locale/mi';
import 'dayjs/locale/mk';
import 'dayjs/locale/ml';
import 'dayjs/locale/mn';
import 'dayjs/locale/mr';
import 'dayjs/locale/ms-my';
import 'dayjs/locale/ms';
import 'dayjs/locale/mt';
import 'dayjs/locale/my';
import 'dayjs/locale/nb';
import 'dayjs/locale/ne';
import 'dayjs/locale/nl-be';
import 'dayjs/locale/nl';
import 'dayjs/locale/pl';
import 'dayjs/locale/pt-br';
import 'dayjs/locale/pt';
import 'dayjs/locale/rn';
import 'dayjs/locale/ro';
import 'dayjs/locale/ru';
import 'dayjs/locale/rw';
import 'dayjs/locale/sd';
import 'dayjs/locale/se';
import 'dayjs/locale/si';
import 'dayjs/locale/sk';
import 'dayjs/locale/sl';
import 'dayjs/locale/sq';
import 'dayjs/locale/sr-cyrl';
import 'dayjs/locale/ss';
import 'dayjs/locale/sv-fi';
import 'dayjs/locale/sr';
import 'dayjs/locale/sv';
import 'dayjs/locale/sw';
import 'dayjs/locale/ta';
import 'dayjs/locale/te';
import 'dayjs/locale/tet';
import 'dayjs/locale/tg';
import 'dayjs/locale/th';
import 'dayjs/locale/tk';
import 'dayjs/locale/tl-ph';
import 'dayjs/locale/tlh';
import 'dayjs/locale/tr';
import 'dayjs/locale/tzl';
import 'dayjs/locale/tzm-latn';
import 'dayjs/locale/tzm';
import 'dayjs/locale/ug-cn';
import 'dayjs/locale/uk';
import 'dayjs/locale/ur';
import 'dayjs/locale/uz-latn';
import 'dayjs/locale/uz';
import 'dayjs/locale/vi';
import 'dayjs/locale/x-pseudo';
import 'dayjs/locale/yo';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-hk';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh';
import 'dayjs/locale/oc-lnc';
import 'dayjs/locale/nn';
import 'dayjs/locale/pa-in';

import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.locale(t('dayjs'));

console.debug('当前 i18n 语言', i18n.global.locale.value);
console.debug('尝试加载的 dayjs i18n 语言', t('dayjs'));
console.debug('当前 dayjs i18n 语言', dayjs.locale());

// #endregion 初始化 dayjs i18n
