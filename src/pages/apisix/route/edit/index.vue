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

        <t-form v-show="activeStep === 1" class="step-form" :data="formData" :rules="FORM_RULES_1" @submit="onNextStep">
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
    }
    console.error(e);
  }
  dataLoading.value = false;
};
const create = () => {
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
