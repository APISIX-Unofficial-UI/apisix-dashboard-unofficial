<template>
  <div class="plugin-config-editor">
    <h3>{{ pluginName }}</h3>
    <code-editor v-model:value="configStr" language="json" />
    <t-button variant="text" theme="danger" @click="$emit('remove')"> <t-icon name="delete" /> 移除 </t-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import CodeEditor from '@/components/code-editor/index.vue'; // 新增导入

const props = defineProps({
  pluginName: String,
  config: Object,
});

const emit = defineEmits(['update:config', 'remove']);

const configStr = ref(JSON.stringify(props.config, null, 2));

watch(configStr, (newStr) => {
  try {
    const newConfig = JSON.parse(newStr);
    emit('update:config', newConfig);
  } catch (e) {
    console.error('Invalid JSON');
  }
});

watch(
  () => props.config,
  (newConfig) => {
    configStr.value = JSON.stringify(newConfig, null, 2);
  },
  { deep: true },
);
</script>

<style lang="less" scoped>
.plugin-config-editor {
  margin-bottom: var(--td-comp-margin-lg);
  .t-button {
    margin-top: var(--td-comp-margin-md);
  }
}
</style>
