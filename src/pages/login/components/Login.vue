<template>
  <t-form
    ref="form"
    :class="['item-container']"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="adminEndpoint">
      <t-input
        v-model="formData.adminEndpoint"
        size="large"
        :placeholder="`${t('pages.login.input.adminEndpoint')}：http://127.0.0.1:9180`"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="adminKey">
      <t-input
        v-model="formData.adminKey"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        :placeholder="`${t('pages.login.input.adminKey')}：xxxxxxxxxxxx`"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="ctrlEndpoint">
      <t-input
        v-model="formData.ctrlEndpoint"
        size="large"
        :placeholder="`${t('pages.login.input.ctrlEndpoint')}：http://127.0.0.1:9090`"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="ctrlKey">
      <t-input
        v-model="formData.ctrlKey"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        :placeholder="`${t('pages.login.input.ctrlKey')}：xxxxxxxxxxxx`"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <div class="check-container keep-login">
      <t-checkbox v-model="formData.keepLogin">{{ t('pages.login.keepLogin') }}</t-checkbox>
    </div>

    <t-form-item class="btn-container">
      <t-button block size="large" type="submit"> {{ t('pages.login.signIn') }} </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import type { FormInstanceFunctions, FormRule, SubmitContext } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { t } from '@/locales';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const env = import.meta.env.MODE || 'development';

const INITIAL_DATA = {
  // 如果是mock模式 或 启用Vite代理
  adminEndpoint:
    env === 'mock' || import.meta.env.VITE_ENABLE_VITE_PROXY === 'true'
      ? import.meta.env.VITE_APISIX_ADMIN_API_PROXY_ENDPOINT // 走本地Mock拦截 或 Vite 代理
      : import.meta.env.VITE_APISIX_ADMIN_API_ENDPOINT, // 直连
  adminKey: '',
  // 如果是mock模式 或 没启用Vite代理
  ctrlEndpoint:
    env === 'mock' || import.meta.env.VITE_ENABLE_VITE_PROXY === 'true'
      ? import.meta.env.VITE_APISIX_CONTROL_API_PROXY_ENDPOINT // 走本地Mock拦截 或 Vite 代理
      : import.meta.env.VITE_APISIX_CONTROL_API_ENDPOINT, // 直连
  ctrlKey: '',
  keepLogin: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  adminEndpoint: [{ required: true, message: t('pages.login.required.adminEndpoint'), type: 'error' }],
  adminKey: [{ required: true, message: t('pages.login.required.adminKey'), type: 'error' }],
};

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const router = useRouter();
const route = useRoute();

const onSubmit = async (ctx: SubmitContext) => {
  if (ctx.validateResult === true) {
    try {
      await userStore.login(
        formData.value.adminEndpoint,
        formData.value.adminKey,
        formData.value.ctrlEndpoint,
        formData.value.ctrlKey,
        formData.value.keepLogin,
      );

      MessagePlugin.success('登录成功');
      const redirect = route.query.redirect as string;
      const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard';
      router.push(redirectUrl);
    } catch (e) {
      console.log(e);
      MessagePlugin.error(e.message);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
