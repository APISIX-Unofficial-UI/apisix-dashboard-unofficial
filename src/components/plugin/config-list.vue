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
      <t-select v-model="selectedPlugin" :options="availablePluginOptions" placeholder="请选择插件" />
    </t-dialog>

    <!-- 编辑对话框 -->
    <t-dialog v-model:visible="editDialogVisible" header="编辑插件配置" @confirm="onEditConfirm">
      <plugin-config-editor
        :plugin-name="currentEditingPlugin"
        :config="tempConfig.config || {}"
        @update:config="(newConfig: Record<string, any>) => (tempConfig.config = newConfig)"
      />
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-underscore-dangle */
import { computed, onMounted, ref } from 'vue';

import { PluginApi } from '@/api/apisix/admin';
import PluginConfigEditor from '@/components/plugin/config-editor.vue';

defineOptions({ name: 'PluginConfigList' });

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
    const meta = config._meta || {};
    // 默认启用：meta.disable 没有定义或不为 true
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

// 选择插件后，打开编辑对话框，并初始化 tempConfig
const onSelectPlugin = () => {
  if (selectedPlugin.value) {
    currentEditingPlugin.value = selectedPlugin.value;
    tempConfig = { config: {}, status: 1 }; // 新插件初始配置为空对象，默认启用
    selectionDialogVisible.value = false;
    editDialogVisible.value = true;
    selectedPlugin.value = '';
  }
};

// 编辑已有插件时，打开编辑对话框并载入配置
const openEditDialog = (pluginName: string) => {
  currentEditingPlugin.value = pluginName;
  tempConfig = { ...props.plugins[pluginName] };
  editDialogVisible.value = true;
};

// 编辑对话框确认后，更新或新增插件配置
const onEditConfirm = () => {
  const updatedPlugins = { ...props.plugins };
  updatedPlugins[currentEditingPlugin.value] = {
    ...tempConfig,
    status: tempConfig.status ?? 1, // 确保有status字段，默认为启用
  };

  emit('update:plugins', updatedPlugins);
  editDialogVisible.value = false;
};

// 删除插件
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
