<template>
  <div class="plugin-config-list">
    <t-space direction="vertical" style="width: 100%">
      <t-button @click="selectionDialogVisible = true"> <t-icon name="add" />添加插件 </t-button>

      <t-table row-key="name" :data="tableData" :columns="columns" :hover="true" :loading="loading" style="width: 100%">
        <template #op="{ row }">
          <t-space>
            <t-switch
              v-model:checked="row.enabled"
              size="large"
              :label="['启用', '禁用']"
              @change="(val) => togglePluginStatus(row.name, val === true)"
            />
            <t-button variant="text" theme="primary" @click="openEditDialog(row.name)">
              <t-icon name="edit" />编辑
            </t-button>
            <t-button variant="text" theme="danger" @click="removePlugin(row.name)">
              <t-icon name="delete" />删除
            </t-button>
          </t-space>
        </template>
      </t-table>
    </t-space>

    <!-- 插件选择对话框 -->
    <t-dialog v-model:visible="selectionDialogVisible" header="选择插件" @confirm="onSelectPlugin">
      <t-select v-model="selectedPlugin" filterable :options="availablePluginOptions" placeholder="请选择插件" />
    </t-dialog>

    <!-- 编辑抽屉，使用抽屉自身的确定、取消按钮 -->
    <t-drawer v-model:visible="editDialogVisible" size="medium" @confirm="onEditConfirm" @cancel="onEditCancel">
      <template #header>编辑插件配置</template>
      <plugin-config-editor
        :plugin-name="currentEditingPlugin"
        :config="tempConfig.config || {}"
        @update:config="(newConfig: Record<string, any>) => (tempConfig.config = newConfig)"
      />
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-underscore-dangle */
import { computed, onMounted, ref } from 'vue';

import { PluginApi } from '@/api/apisix/admin';
import PluginConfigEditor from '@/components/plugin/config-editor.vue';
import { fetchPluginSchema, generateDefaultFromSchema, validateConfigWithSchema } from '@/utils/plugin-schema';

defineOptions({ name: 'PluginConfigList' });

const currentPluginSchema = ref<any>(null);

interface PluginEntry {
  config: Record<string, any>;
  status?: number;
}

const props = defineProps<{ plugins: Record<string, PluginEntry> }>();
const emit = defineEmits(['update:plugins']);

const loading = ref(false);
const availablePlugins = ref<string[]>([]);
const selectedPlugin = ref('');
const selectionDialogVisible = ref(false);
const editDialogVisible = ref(false);
const currentEditingPlugin = ref('');
let tempConfig: PluginEntry = { config: {} };

const columns = [
  { colKey: 'name', title: '插件名称', width: 200 },
  { colKey: 'op', title: '操作', width: 240 },
];

const tableData = computed(() => {
  return Object.entries(props.plugins || {}).map(([name, pluginEntry]) => {
    const config = pluginEntry.config || {};
    const meta = config._meta || {
      disable: false,
    };
    return {
      name,
      config,
      enabled: meta.disable !== true,
    };
  });
});

const togglePluginStatus = (pluginName: string, enabled: boolean) => {
  const updatedPlugins = { ...props.plugins };
  if (!updatedPlugins[pluginName]) {
    updatedPlugins[pluginName] = { config: {} };
  }
  const currentConfig = updatedPlugins[pluginName].config || {};
  const currentMeta = currentConfig._meta || {};
  updatedPlugins[pluginName].config = {
    ...currentConfig,
    _meta: {
      ...currentMeta,
      disable: !enabled,
    },
  };
  emit('update:plugins', updatedPlugins);
};

// 获取可用插件列表
onMounted(async () => {
  try {
    const res = await PluginApi.apisixAdminPluginsListGet();
    availablePlugins.value = res.data || [];
  } catch (error) {
    console.error('无法获取可用插件列表:', error);
  }
});

// 计算可选项（排除已添加的插件）
const availablePluginOptions = computed(() =>
  availablePlugins.value.filter((plugin) => !props.plugins[plugin]).map((plugin) => ({ label: plugin, value: plugin })),
);

// 修改：选择插件后，通过工具方法获取 schema 并生成默认配置
const onSelectPlugin = async () => {
  if (selectedPlugin.value) {
    try {
      const schema = await fetchPluginSchema(selectedPlugin.value);
      currentPluginSchema.value = schema;
      tempConfig = { config: generateDefaultFromSchema(schema), status: 1 };
      currentEditingPlugin.value = selectedPlugin.value;
    } catch (error) {
      console.error('获取插件 schema 出错:', error);
      return;
    }
    selectionDialogVisible.value = false;
    editDialogVisible.value = true;
    selectedPlugin.value = '';
  }
};

// 修改：编辑插件时，同步获取 schema
const openEditDialog = async (pluginName: string) => {
  try {
    const schema = await fetchPluginSchema(pluginName);
    currentPluginSchema.value = schema;
  } catch (error) {
    console.error('获取插件 schema 出错:', error);
    return;
  }
  currentEditingPlugin.value = pluginName;
  tempConfig = { ...props.plugins[pluginName] };
  editDialogVisible.value = true;
};

// 修改：保存前根据 schema 校验配置
const onEditConfirm = async () => {
  if (currentPluginSchema.value) {
    const { valid, errors } = await validateConfigWithSchema(tempConfig.config, currentPluginSchema.value);
    if (!valid) {
      alert(`配置不合法: ${JSON.stringify(errors)}`);
      return;
    }
  }
  const updatedPlugins = { ...props.plugins };
  updatedPlugins[currentEditingPlugin.value] = {
    ...tempConfig,
    status: tempConfig.status ?? 1,
  };
  emit('update:plugins', updatedPlugins);
  editDialogVisible.value = false;
};

const onEditCancel = () => {
  editDialogVisible.value = false;
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
}
</style>
