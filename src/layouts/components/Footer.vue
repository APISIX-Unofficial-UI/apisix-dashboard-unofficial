<template>
  <div :class="prefix + '-footer'">
    <div>https://github.com/APISIX-Unofficial-UI/apisix-dashboard-unofficial</div>
    <div>
      Apache APISIX, APISIX®, Apache, the Apache feather logo, and the Apache APISIX project logo are either registered
      trademarks or trademarks of the Apache Software Foundation.
    </div>
  </div>
</template>

<script setup lang="ts">
import { prefix } from '@/config/global';
</script>

<style lang="less" scoped>
.@{starter-prefix}-footer {
  color: var(--td-text-color-placeholder);
  line-height: 20px;
  text-align: center;
}
</style>
