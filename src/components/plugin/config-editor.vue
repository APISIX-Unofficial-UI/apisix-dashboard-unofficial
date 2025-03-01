<template>
  <div class="plugin-config-editor">
    <h3>{{ pluginName }}</h3>
    <t-divider dashed />
    <t-collapse v-model:value="activePanel" expand-mutex>
      <t-collapse-panel value="schema" :header="t('components.plugin.configEditor.config_description')">
        <schema-info :schema="schema" />
      </t-collapse-panel>
    </t-collapse>
    <code-editor v-model:value="configStr" language="json" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import CodeEditor from '@/components/code-editor/index.vue';
import { t } from '@/locales';

import SchemaInfo from './schema-info.vue';

const props = defineProps({
  pluginName: String,
  config: Object,
  schema: Object,
});

const configStr = ref(JSON.stringify(props.config, null, 2));
const activePanel = ref(['schema']);

const getParsedConfig = () => {
  try {
    return JSON.parse(configStr.value);
  } catch (e) {
    console.error('Invalid JSON configuration');
    return null;
  }
};
defineExpose({ getParsedConfig });

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

  .t-collapse {
    margin-bottom: var(--td-comp-margin-m);
  }

  .t-button {
    margin-top: var(--td-comp-margin-md);
  }
}
</style>
