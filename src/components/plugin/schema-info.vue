<template>
  <t-card class="schema-info">
    <div v-if="Object.keys(fieldInfos).length === 0" class="empty-hint">
      {{ t('components.apisixRoute.plugin.schema_empty_hint') }}
    </div>
    <div v-for="(field, key) in fieldInfos" :key="key" class="field">
      <t-tag theme="primary" variant="light">{{ key }}</t-tag>
      <span class="type">{{ field.type }}</span>
      <t-tag v-if="field.required" theme="warning" variant="light">{{
        t('components.plugin.schemaInfo.required')
      }}</t-tag>
      <div v-if="field.description" class="description">{{ field.description }}</div>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { t } from '@/locales';

const props = defineProps<{
  schema: any;
}>();

interface FieldInfo {
  type: string;
  required: boolean;
  description?: string;
  default?: any;
}

const fieldInfos = computed(() => {
  const result: Record<string, FieldInfo> = {};
  const properties = props.schema?.properties || {};
  const required = props.schema?.required || [];

  for (const [key, prop] of Object.entries(properties)) {
    if (key === '_meta' && typeof prop === 'object' && '_meta' in prop) {
      continue;
    }
    const fieldInfo: FieldInfo = {
      type: (prop as any).type || t('components.apisixRoute.plugin.unknown'),
      required: required.includes(key),
      description: (prop as any).description,
      default: (prop as any).default,
    };
    result[key] = fieldInfo;
  }

  return result;
});
</script>

<style lang="less" scoped>
.schema-info {
  margin: var(--td-comp-margin-m) 0;

  .field {
    margin-bottom: var(--td-comp-margin-xs);
    padding: var(--td-comp-padding-xs);

    .type {
      margin: 0 var(--td-comp-margin-xs);
      color: var(--td-text-color-secondary);
    }

    .description {
      margin-top: var(--td-comp-margin-xs);
      color: var(--td-text-color-secondary);
      font-size: var(--td-font-size-body-small);
    }

    .default {
      margin-top: var(--td-comp-margin-xs);
      font-size: var(--td-font-size-body-small);

      code {
        background: var(--td-bg-color-container);
        padding: 2px 4px;
        border-radius: var(--td-radius-small);
        white-space: nowrap; // 添加以防止默认值换行
      }
    }
  }

  .empty-hint {
    color: var(--td-text-color-placeholder);
    text-align: center;
    padding: var(--td-comp-padding-s);
  }
}
</style>
