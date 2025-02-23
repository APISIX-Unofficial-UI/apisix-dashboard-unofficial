<template>
  <t-form
    ref="form"
    :class="['item-container']"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="apisixAdminEndpoint">
      <t-input
        v-model="formData.apisixAdminEndpoint"
        size="large"
        :placeholder="`${t('pages.login.input.apisixAdminEndpoint')}：http://127.0.0.1:9180`"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="apisixControlEndpoint">
      <t-input
        v-model="formData.apisixControlEndpoint"
        size="large"
        :placeholder="`${t('pages.login.input.apisixControlEndpoint')}：http://127.0.0.1:9090`"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.apisixAdminKey"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        :placeholder="`${t('pages.login.input.apisixAdminKey')}：xxxxxxxxxxxx`"
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
  apisixAdminEndpoint:
    env === 'mock' || import.meta.env.VITE_ENABLE_VITE_PROXY === 'true'
      ? import.meta.env.VITE_APISIX_ADMIN_API_PROXY_ENDPOINT // 走本地Mock拦截 或 Vite 代理
      : import.meta.env.VITE_APISIX_ADMIN_API_ENDPOINT, // 直连
  // 如果是mock模式 或 没启用Vite代理
  apisixControlEndpoint:
    env === 'mock' || import.meta.env.VITE_ENABLE_VITE_PROXY === 'true'
      ? import.meta.env.VITE_APISIX_CONTROL_API_PROXY_ENDPOINT // 走本地Mock拦截 或 Vite 代理
      : import.meta.env.VITE_APISIX_CONTROL_API_ENDPOINT, // 直连
  apisixAdminKey: '',
  keepLogin: false,
};

const FORM_RULES: Record<string, FormRule[]> = {
  apisixAdminEndpoint: [{ required: true, message: t('pages.login.required.apisixAdminEndpoint'), type: 'error' }],
  apisixControlEndpoint: [{ required: false, message: t('pages.login.required.apisixAdminEndpoint'), type: 'error' }],
  apisixAdminKey: [{ required: true, message: t('pages.login.required.apisixAdminKey'), type: 'error' }],
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
        formData.value.apisixAdminEndpoint,
        formData.value.apisixControlEndpoint,
        formData.value.apisixAdminKey,
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
