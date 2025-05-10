<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">{{ t('pages.login.loginTitle') }}</h1>
        <h1 class="title">Apisix Dashboard</h1>
        <div class="sub-title"></div>
      </div>

      <login />
      <tdesign-setting />
    </div>

    <footer class="copyright">
      <div>https://github.com/APISIX-Unofficial-UI/apisix-dashboard-unofficial</div>
      <div>
        Apache APISIX, APISIX®, Apache, the Apache feather logo, and the Apache APISIX project logo are either
        registered trademarks or trademarks of the Apache Software Foundation.
      </div>
    </footer>
  </div>
</template>
<script lang="ts">
export default {
  name: 'LoginIndex',
};
</script>
<script setup lang="ts">
import TdesignSetting from '@/layouts/setting.vue';
import { t } from '@/locales';

import LoginHeader from './components/Header.vue';
import Login from './components/Login.vue';
</script>

<style lang="less" scoped>
@import './index.less';
</style>
