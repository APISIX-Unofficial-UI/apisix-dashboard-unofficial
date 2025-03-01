<template>
  <div class="plugin-config-list">
    <t-space direction="vertical" style="width: 100%">
      <t-button @click="selectionDialogVisible = true">
        <t-icon name="add" />{{ t('components.plugin.configList.add') }}
      </t-button>

      <t-table row-key="name" :data="tableData" :columns="columns" :hover="true" :loading="loading" style="width: 100%">
        <template #op="{ row }">
          <t-space>
            <t-button class="action-button" variant="text" theme="primary" @click="openEditDialog(row.name)">
              {{ t('components.plugin.configList.edit') }}
            </t-button>
            <t-button class="action-button" variant="text" theme="danger" @click="confirmRemovePlugin(row.name)">
              {{ t('components.plugin.configList.delete') }}
            </t-button>
          </t-space>
        </template>
      </t-table>
    </t-space>

    <!-- 插件选择对话框 -->
    <t-dialog
      v-model:visible="selectionDialogVisible"
      :header="t('components.plugin.configList.select')"
      @confirm="onSelectPlugin"
    >
      <t-select
        v-model="selectedPlugin"
        filterable
        :options="availablePluginOptions"
        :placeholder="t('components.plugin.configList.select_placeholder')"
      />
    </t-dialog>

    <!-- 编辑抽屉，使用抽屉自身的确定、取消按钮 -->
    <t-drawer v-model:visible="editDialogVisible" size="medium" @confirm="onEditConfirm" @cancel="onEditCancel">
      <template #header>{{ t('components.plugin.configList.configuration') }}</template>
      <plugin-config-editor
        ref="configEditorRef"
        :plugin-name="currentEditingPlugin"
        :config="tempConfig || {}"
        :schema="currentPluginSchema"
      />
    </t-drawer>

    <!-- 删除确认对话框 -->
    <t-dialog
      v-model:visible="removeDialogVisible"
      :header="t('components.plugin.configList.confirm_delete')"
      @confirm="onRemoveConfirm"
    >
      <p>{{ t('components.plugin.configList.delete_tip', { pluginName: pluginToRemove }) }}</p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next'; // 新增导入
import { computed, onMounted, ref } from 'vue';

import { PluginApi } from '@/api/apisix/admin';
import PluginConfigEditor from '@/components/plugin/config-editor.vue';
import { t } from '@/locales';
import { fetchPluginSchema, generateDefaultFromSchema, validateConfigWithSchema } from '@/utils/plugin-schema';

defineOptions({ name: 'PluginConfigList' });

const currentPluginSchema = ref<any>({});

const props = defineProps<{ plugins: Record<string, any> }>();
const emit = defineEmits(['update:plugins']);

const loading = ref(false);
const availablePlugins = ref<string[]>([]);
const selectedPlugin = ref('');
const selectionDialogVisible = ref(false);
const editDialogVisible = ref(false);
const currentEditingPlugin = ref('');
const tempConfig = ref<any>({});

const configEditorRef = ref(null);

const columns = [
  { colKey: 'name', title: t('components.plugin.configList.column_name'), width: 300 },
  { colKey: 'op', title: t('components.plugin.configList.column_action'), width: 200, align: 'center' },
];

const tableData = computed(() => {
  return Object.entries(props.plugins || {}).map(([name, pluginConfig]) => {
    return { name, config: pluginConfig || {} };
  });
});

// 获取可用插件列表
onMounted(async () => {
  try {
    const res = await PluginApi.apisixAdminPluginsListGet();
    availablePlugins.value = res.data || [];
  } catch (error) {
    MessagePlugin.error(t('components.plugin.configList.fetch_plugin_failed', { errors: JSON.stringify(error) }));
  }
});

// 计算可选项（排除已添加的插件）
const availablePluginOptions = computed(() =>
  availablePlugins.value.filter((plugin) => !props.plugins[plugin]).map((plugin) => ({ label: plugin, value: plugin })),
);

// 获取插件 schema
const fetchAndSetSchema = async (pluginName: string) => {
  try {
    const schema = await fetchPluginSchema(pluginName);
    currentPluginSchema.value = schema || {};
    return true;
  } catch (error) {
    MessagePlugin.error(
      t('components.plugin.configList.fetch_plugin_schema_failed', { errors: JSON.stringify(error) }),
    );
    currentPluginSchema.value = {};
    return false;
  }
};

// 选择插件后，通过工具方法获取 schema 并生成默认配置
const onSelectPlugin = async () => {
  if (selectedPlugin.value) {
    const success = await fetchAndSetSchema(selectedPlugin.value);
    if (!success) return;
    tempConfig.value = generateDefaultFromSchema(currentPluginSchema.value);
    currentEditingPlugin.value = selectedPlugin.value;
    selectionDialogVisible.value = false;
    editDialogVisible.value = true;
    selectedPlugin.value = '';
  }
};

// 编辑插件时，同步获取 schema
const openEditDialog = async (pluginName: string) => {
  await fetchAndSetSchema(pluginName);
  currentEditingPlugin.value = pluginName;
  tempConfig.value = { ...props.plugins[pluginName] };
  editDialogVisible.value = true;
};

// 保存前根据 schema 校验
const onEditConfirm = async () => {
  const newConfig = configEditorRef.value?.getParsedConfig();
  if (newConfig === null) {
    MessagePlugin.error(t('components.plugin.configList.invalid_json'));
    return;
  }
  if (currentPluginSchema.value) {
    const { valid, errors } = await validateConfigWithSchema(newConfig, currentPluginSchema.value);
    if (!valid) {
      MessagePlugin.error(t('components.plugin.configList.invalid_config', { errors: JSON.stringify(errors) }));
      return;
    }
  }
  const updatedPlugins = { ...props.plugins };
  updatedPlugins[currentEditingPlugin.value] = newConfig;
  emit('update:plugins', updatedPlugins);
  editDialogVisible.value = false;
};

const onEditCancel = () => {
  editDialogVisible.value = false;
};

const removeDialogVisible = ref(false);
const pluginToRemove = ref('');

const confirmRemovePlugin = (pluginName: string) => {
  pluginToRemove.value = pluginName;
  removeDialogVisible.value = true;
};

const onRemoveConfirm = () => {
  removePlugin(pluginToRemove.value);
  removeDialogVisible.value = false;
};

const removePlugin = (pluginName: string) => {
  const updatedPlugins = { ...props.plugins };
  delete updatedPlugins[pluginName];
  emit('update:plugins', updatedPlugins);
};
</script>

<style lang="less" scoped>
.plugin-config-list {
  padding: var(--td-comp-padding-xl);

  .t-button {
    margin-bottom: var(--td-comp-margin-s);
  }

  .plugin-config {
    max-height: 120px;
    overflow: auto;

    pre {
      margin: 0;
      padding: var(--td-comp-padding-xs);
      background: var(--td-bg-color-container);
      border-radius: var(--td-radius-small);
      font-size: var(--td-font-size-body-small);
      font-family: var(--td-font-family-mono);
    }
  }

  :deep(.t-table) {
    margin-top: var(--td-comp-margin-l);
  }

  :deep(.t-table__row) {
    .t-button {
      margin: 0 var(--td-comp-margin-xs);
    }
  }

  .action-button {
    margin: 0;
  }
}
</style>
