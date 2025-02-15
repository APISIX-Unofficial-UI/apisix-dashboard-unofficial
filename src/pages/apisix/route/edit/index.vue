<template>
  <div>
    <div class="form-step-container">
      <t-loading :loading="dataLoading" show-overlay>
        <!-- 简单步骤条 -->
        <t-card :bordered="false">
          <t-steps class="step-container" :current="activeStep - 1" status="process">
            <t-step-item
              :title="t('pages.apisixRouteEdit.step1.title')"
              :content="t('pages.apisixRouteEdit.step1.subtitle')"
            />
            <t-step-item
              :title="t('pages.apisixRouteEdit.step2.title')"
              :content="t('pages.apisixRouteEdit.step2.subtitle')"
            />
            <t-step-item
              :title="t('pages.apisixRouteEdit.step3.title')"
              :content="t('pages.apisixRouteEdit.step3.subtitle')"
            />
            <t-step-item
              :title="t('pages.apisixRouteEdit.step4.title')"
              :content="t('pages.apisixRouteEdit.step4.subtitle')"
            />
          </t-steps>
        </t-card>

        <!-- 分步表单1 设置路由信息 -->
        <t-divider align="left">{{ t('pages.apisixRouteEdit.step1.basic') }}</t-divider>

        <t-form
          v-show="activeStep === 1"
          class="step-form"
          :data="{ ...formData, proxyRewrite }"
          :rules="FORM_RULES_1"
          @submit="onNextStep"
        >
          <t-form-item :label="t('pages.apisixRouteEdit.step1.name')" name="name">
            <t-input
              v-model="formData.name"
              :style="{ width: '480px' }"
              :placeholder="t('pages.apisixRouteEdit.step1.namePlaceholder')"
            />
          </t-form-item>
          <t-form-item :label="t('pages.apisixRouteEdit.step1.id')" name="id">
            <t-input
              v-model="routeId"
              :style="{ width: '480px' }"
              :placeholder="t('pages.apisixRouteEdit.step1.idPlaceholder')"
              :disabled="isUpdateMode"
            />
          </t-form-item>
          <t-form-item :label="t('pages.apisixRouteEdit.step1.desc')" name="desc">
            <t-input
              v-model="formData.desc"
              :style="{ width: '480px' }"
              :placeholder="t('pages.apisixRouteEdit.step1.descPlaceholder')"
            />
          </t-form-item>
          <t-form-item :label="t('pages.apisixRouteEdit.step1.host')" name="host">
            <t-input
              v-model="formData.host"
              :style="{ width: '480px' }"
              :placeholder="t('pages.apisixRouteEdit.step1.hostPlaceholder')"
            />
          </t-form-item>
          <t-form-item :label="t('pages.apisixRouteEdit.step1.methods')" name="methods">
            <t-select
              v-model="formData.methods"
              multiple
              :style="{ width: '480px' }"
              class="demo-select-base"
              clearable
            >
              <t-option v-for="(item, index) in METHOD_OPTIONS" :key="index" :value="item.value" :label="item.label">
                {{ item.label }}
              </t-option>
            </t-select>
          </t-form-item>
          <t-form-item :label="t('pages.apisixRouteEdit.step1.uri')" name="uri">
            <t-input
              v-model="formData.uri"
              :style="{ width: '480px' }"
              :placeholder="t('pages.apisixRouteEdit.step1.uriPlaceholder')"
            />
          </t-form-item>

          <t-divider align="left" class="divider-with-description">
            <div style="display: flex; align-items: center; gap: 16px">
              {{ t('pages.apisixRouteEdit.step1.proxyRewriteTitle') }}
              <span style="font-size: 12px; color: #999">
                {{ t('pages.apisixRouteEdit.step1.proxyRewrite.description') }}
              </span>
            </div>
          </t-divider>

          <!-- 路径改写 -->
          <t-form-item :label="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.label')">
            <t-radio-group v-model="proxyRewrite.uriType">
              <t-radio value="keep">{{ t('pages.apisixRouteEdit.step1.proxyRewrite.uri.keep') }}</t-radio>
              <t-radio value="static">{{ t('pages.apisixRouteEdit.step1.proxyRewrite.uri.static') }}</t-radio>
              <t-radio value="regex">{{ t('pages.apisixRouteEdit.step1.proxyRewrite.uri.regex') }}</t-radio>
            </t-radio-group>
          </t-form-item>

          <t-form-item
            v-if="proxyRewrite.uriType === 'static'"
            :label="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.newPath')"
            name="proxyRewrite.uri"
          >
            <t-input
              v-model="proxyRewrite.uri"
              style="width: 480px"
              :placeholder="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.newPathPlaceholder')"
            />
          </t-form-item>

          <t-form-item
            v-if="proxyRewrite.uriType === 'regex'"
            :label="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.regexMatch')"
            name="proxyRewrite.regexMatch"
          >
            <t-input
              v-model="proxyRewrite.regexMatch"
              style="width: 480px"
              :placeholder="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.regexMatchPlaceholder')"
            />
          </t-form-item>

          <t-form-item
            v-if="proxyRewrite.uriType === 'regex'"
            :label="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.regexTemplate')"
            name="proxyRewrite.regexTemplate"
          >
            <t-input
              v-model="proxyRewrite.regexTemplate"
              style="width: 480px"
              :placeholder="t('pages.apisixRouteEdit.step1.proxyRewrite.uri.regexTemplatePlaceholder')"
            />
          </t-form-item>

          <!-- 域名改写 -->
          <t-form-item :label="t('pages.apisixRouteEdit.step1.proxyRewrite.host.label')">
            <t-radio-group v-model="proxyRewrite.hostType">
              <t-radio value="keep">{{ t('pages.apisixRouteEdit.step1.proxyRewrite.host.keep') }}</t-radio>
              <t-radio value="static">{{ t('pages.apisixRouteEdit.step1.proxyRewrite.host.static') }}</t-radio>
            </t-radio-group>
          </t-form-item>

          <t-form-item
            v-if="proxyRewrite.hostType === 'static'"
            :label="t('pages.apisixRouteEdit.step1.proxyRewrite.host.newHost')"
            name="proxyRewrite.host"
          >
            <t-input
              v-model="proxyRewrite.host"
              style="width: 480px"
              :placeholder="t('pages.apisixRouteEdit.step1.proxyRewrite.host.newHostPlaceholder')"
            />
          </t-form-item>

          <!-- HTTP方法改写 -->
          <t-form-item :label="t('pages.apisixRouteEdit.step1.proxyRewrite.methodRewrite.label')">
            <t-select v-model="proxyRewrite.method" class="method-rewrite-select" :style="{ width: '480px' }">
              <t-option value="">{{ t('pages.apisixRouteEdit.step1.proxyRewrite.methodRewrite.keep') }}</t-option>
              <t-option v-for="(item, index) in METHOD_OPTIONS" :key="index" :value="item.value" :label="item.label">
                {{ item.label }}
              </t-option>
            </t-select>
          </t-form-item>

          <!-- 请求头改写 -->
          <t-form-item :label="t('pages.apisixRouteEdit.step1.proxyRewrite.headers.label')">
            <div class="headers-container">
              <div v-for="(header, index) in proxyRewrite.headers" :key="index" class="header-row">
                <t-input
                  v-model="header.name"
                  class="header-input"
                  :placeholder="t('pages.apisixRouteEdit.step1.proxyRewrite.headers.namePlaceholder')"
                />
                <t-input
                  v-model="header.value"
                  class="header-input"
                  :placeholder="t('pages.apisixRouteEdit.step1.proxyRewrite.headers.valuePlaceholder')"
                />
                <t-button
                  v-if="proxyRewrite.headers.length > 1"
                  variant="text"
                  theme="danger"
                  class="remove-button"
                  @click="removeHeader(index)"
                >
                  <t-icon name="remove" />
                </t-button>
              </div>
              <t-button variant="text" class="add-header-button" @click="addHeader">
                <t-icon name="add" />
              </t-button>
            </div>
          </t-form-item>

          <t-divider align="left">{{ t('pages.apisixRouteEdit.step1.upstream') }}</t-divider>

          <upstream-form
            v-show="activeStep === 1"
            v-model="
              computed({
                get: () => {
                  if (!formData.upstream) {
                    formData.upstream = {};
                  }
                  return formData.upstream;
                },
                set: (v) => {
                  if (!formData.upstream) {
                    formData.upstream = {};
                  }
                  formData.upstream = v;
                },
              }).value
            "
            style="margin-bottom: var(--td-comp-margin-xxl)"
          >
          </upstream-form>

          <t-form-item>
            <t-button disabled theme="default" variant="base" @click="onPreStep">
              {{ t('pages.apisixRouteEdit.preStep') }}
            </t-button>
            <t-button type="submit" theme="primary"> {{ t('pages.apisixRouteEdit.nextStep') }} </t-button>
          </t-form-item>
        </t-form>

        <!-- 分步表单2 插件配置 -->
        <t-form v-show="activeStep === 2" class="step-form" :data="formData" :rules="FORM_RULES_2" @submit="onNextStep">
          <t-form-item :label="t('pages.apisixRouteEdit.step2.title')">
            <code-editor ref="pluginEditorRef" v-model:value="pluginEditorData" language="json" />
          </t-form-item>
          <t-form-item>
            <t-button theme="default" variant="base" @click="onPreStep">{{
              t('pages.apisixRouteEdit.preStep')
            }}</t-button>
            <t-button type="submit" theme="primary"> {{ t('pages.apisixRouteEdit.nextStep') }} </t-button>
          </t-form-item>
        </t-form>

        <!-- 分步表单3 预览 -->
        <t-form v-show="activeStep === 3" class="step-form" :data="formData" :rules="FORM_RULES_3" @submit="onSubmit">
          <t-form-item :label="t('pages.apisixRouteEdit.step3.title')">
            <code-editor
              ref="previewEditorRef"
              v-model:value="previewEditorData"
              language="json"
              :options="{ readOnly: true }"
            />
          </t-form-item>
          <t-form-item>
            <t-button theme="default" variant="base" @click="onPreStep">{{
              t('pages.apisixRouteEdit.preStep')
            }}</t-button>
            <t-button type="submit" theme="primary"> {{ t('pages.apisixRouteEdit.submit') }} </t-button>
          </t-form-item>
        </t-form>

        <!-- 分步表单4 完成 -->
        <div v-show="activeStep === 4" class="result-success">
          <t-icon class="result-success-icon" name="check-circle" />
          <div class="result-success-title">{{ t('pages.apisixRouteEdit.step4.successTitle') }}</div>
          <div class="result-success-describe">{{ t('pages.apisixRouteEdit.step4.successDescribe') }}</div>
          <div>
            <t-button @click="onComplete">
              {{ t('pages.apisixRouteEdit.step4.complete') }}
            </t-button>
            <t-button theme="default" @click="onReapply">
              {{ t('pages.apisixRouteEdit.step4.reapply') }}
            </t-button>
          </div>
        </div>
      </t-loading>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ApisixRouteEdit',
};
</script>

<script setup lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { computed, onActivated, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { RouteApi } from '@/api/apisix/admin';
import {
  ApisixAdminRoutesPost201Response,
  ApisixAdminRoutesPostRequest,
  RouteApiApisixAdminRoutesIdGetRequest,
  RouteApiApisixAdminRoutesIdPutRequest,
  RouteApiApisixAdminRoutesPostRequest,
} from '@/api/apisix/admin/typescript-axios';
import UpstreamForm from '@/components/apisix/upstream-form.vue';
import CodeEditor from '@/components/code-editor/index.vue';
import { t } from '@/locales';

import { FORM_RULES_1, FORM_RULES_2, FORM_RULES_3, METHOD_OPTIONS } from './constants';

let INITIAL_DATA: ApisixAdminRoutesPostRequest = {};

const formData = ref<ApisixAdminRoutesPostRequest>(INITIAL_DATA);
const routeId = ref<string>('');
const isUpdateMode = ref(false);
const activeStep = ref(1);

// Proxy rewrite logic.
const proxyRewrite = ref({
  uriType: 'keep',
  uri: '',
  regexMatch: '',
  regexTemplate: '',
  hostType: 'keep',
  host: '',
  method: '',
  headers: [{ name: '', value: '' }],
});

const addHeader = () => {
  proxyRewrite.value.headers.push({ name: '', value: '' });
};

const removeHeader = (index: number) => {
  proxyRewrite.value.headers.splice(index, 1);
};

function parseProxyRewritePlugin() {
  const config = formData.value.plugins?.['proxy-rewrite'];
  if (config) {
    if (config.regex_uri) {
      proxyRewrite.value.uriType = 'regex';
      proxyRewrite.value.regexMatch = config.regex_uri[0] || '';
      proxyRewrite.value.regexTemplate = config.regex_uri[1] || '';
      proxyRewrite.value.uri = '';
    } else if (config.uri) {
      proxyRewrite.value.uriType = 'static';
      proxyRewrite.value.uri = config.uri;
      proxyRewrite.value.regexMatch = '';
      proxyRewrite.value.regexTemplate = '';
    } else {
      proxyRewrite.value.uriType = 'keep';
      proxyRewrite.value.uri = '';
      proxyRewrite.value.regexMatch = '';
      proxyRewrite.value.regexTemplate = '';
    }

    if (config.host) {
      proxyRewrite.value.hostType = 'static';
      proxyRewrite.value.host = config.host;
    } else {
      proxyRewrite.value.hostType = 'keep';
      proxyRewrite.value.host = '';
    }

    proxyRewrite.value.method = config.method ?? '';

    const setObj = config.headers?.set ?? {};
    const headersArray = Object.entries(setObj).map(([k, v]) => ({ name: k, value: v }));
    proxyRewrite.value.headers = headersArray.length ? headersArray : [{ name: '', value: '' }];
  }
}

watch(
  proxyRewrite,
  (newValue) => {
    if (!formData.value.plugins) {
      formData.value.plugins = {};
    }

    const proxyRewriteConfig: any = {};

    if (newValue.uriType === 'static' && newValue.uri) {
      proxyRewriteConfig.uri = newValue.uri;
    } else if (newValue.uriType === 'regex' && newValue.regexMatch && newValue.regexTemplate) {
      proxyRewriteConfig.regex_uri = [newValue.regexMatch, newValue.regexTemplate];
    }

    if (newValue.hostType === 'static' && newValue.host) {
      proxyRewriteConfig.host = newValue.host;
    }

    if (newValue.method) {
      proxyRewriteConfig.method = newValue.method;
    }

    const headers = newValue.headers.filter((h) => h.name && h.value);
    if (headers.length > 0) {
      proxyRewriteConfig.headers = {
        set: Object.fromEntries(headers.map((h) => [h.name, h.value])),
      };
    }

    if (Object.keys(proxyRewriteConfig).length > 0) {
      (formData.value.plugins as Record<string, any>)['proxy-rewrite'] = proxyRewriteConfig;
    } else {
      delete (formData.value.plugins as Record<string, any>)['proxy-rewrite'];
    }
  },
  { deep: true },
);

const router = useRouter();

onActivated(async () => {
  onReset();

  const queryId = router.currentRoute.value.query.id;
  if (queryId) {
    isUpdateMode.value = true;
    routeId.value = queryId.toString();
    fetchData(routeId.value);
  } else {
    isUpdateMode.value = false;
  }
});

const dataLoading = ref(false);
const fetchData = async (id: string) => {
  dataLoading.value = true;
  try {
    const res = await RouteApi.apisixAdminRoutesIdGet({ id });
    INITIAL_DATA = res.data.value;
    formData.value = cloneDeep(INITIAL_DATA);
    parseProxyRewritePlugin();
  } catch (e) {
    console.error(e); // TODO Message
  }
  dataLoading.value = false;
};

const onNextStep = (result: SubmitContext) => {
  console.debug('ApisixRouteEdit onNextStep validation', result);
  if (result.validateResult !== true) {
    return;
  }

  activeStep.value++;
};
const onPreStep = (_e: MouseEvent) => {
  activeStep.value--;
};
const onReset = () => {
  activeStep.value = 1;
  INITIAL_DATA = {};
  formData.value = cloneDeep(INITIAL_DATA);
  routeId.value = '';
  isUpdateMode.value = false;
  proxyRewrite.value = {
    uriType: 'keep',
    uri: '',
    regexMatch: '',
    regexTemplate: '',
    hostType: 'keep',
    host: '',
    method: '',
    headers: [{ name: '', value: '' }],
  };
};
const onReapply = () => {
  onReset();
  router.replace({ query: null }); // clean query id
};
const onSubmit = async (result: SubmitContext) => {
  console.debug('ApisixRouteEdit onSubmit validation', result);
  if (result.validateResult !== true) {
    return;
  }

  delete (formData.value as any).create_time;
  delete (formData.value as any).update_time;

  dataLoading.value = true;
  let res: AxiosResponse<ApisixAdminRoutesPost201Response>;
  try {
    if (isUpdateMode.value) {
      res = await update();
    } else {
      res = await create();
    }
    onNextStep(result);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response.data.error_msg) {
        MessagePlugin.error(t('pages.apisixRouteEdit.submitError', { message: e.response.data.error_msg }));
      }
    } else if (e instanceof Error && e.message === t('pages.apisixRouteEdit.routeExistsError')) {
      MessagePlugin.error(e.message);
    } else {
      MessagePlugin.error(t('pages.apisixRouteEdit.unknownError', { message: String(e) }));
    }
    console.error(e);
  }
  console.error(res);
  dataLoading.value = false;
};
const create = async () => {
  // Custom id.
  if (routeId.value !== '') {
    try {
      // Check if route exists.
      const checkReq: RouteApiApisixAdminRoutesIdGetRequest = {
        id: routeId.value,
      };
      await RouteApi.apisixAdminRoutesIdGet(checkReq);

      // route exists, throw.
      throw new Error(t('pages.apisixRouteEdit.routeExistsError'));
    } catch (error) {
      // route does not exist.
      if (error.response?.status === 404) {
        const req: RouteApiApisixAdminRoutesIdPutRequest = {
          id: routeId.value,
          apisixAdminRoutesPostRequest: formData.value,
        };
        return RouteApi.apisixAdminRoutesIdPut(req);
      }

      throw error;
    }
  }

  const req: RouteApiApisixAdminRoutesPostRequest = {
    apisixAdminRoutesPostRequest: formData.value,
  };
  return RouteApi.apisixAdminRoutesPost(req);
};
const update = () => {
  const req: RouteApiApisixAdminRoutesIdPutRequest = {
    id: routeId.value as string,
    apisixAdminRoutesPostRequest: formData.value,
  };
  return RouteApi.apisixAdminRoutesIdPut(req);
};
const onComplete = () => {
  router.back();
};
// 配置编辑器
const pluginEditorRef = ref<InstanceType<typeof CodeEditor>>();
const pluginEditorData = ref('');
const previewEditorRef = ref<InstanceType<typeof CodeEditor>>();
const previewEditorData = ref('');
watch(activeStep, (newStep, oldStep) => {
  // <!-- 分步表单2 插件配置 -->
  if (newStep === 2) {
    pluginEditorRef.value.loadJson(formData.value, true);
  }
  if (oldStep === 2) {
    formData.value = pluginEditorRef.value.parseJson();
  }
  // <!-- 分步表单3 预览 -->
  if (newStep === 3) {
    previewEditorRef.value.loadJson(formData.value, true);
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
