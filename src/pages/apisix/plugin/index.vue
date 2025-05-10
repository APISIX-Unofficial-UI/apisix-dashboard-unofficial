<template>
  <div>
    <t-card :title="t('pages.apisixPlugin.title')" :bordered="false"> {{ t('pages.apisixPlugin.subtitle') }}} </t-card>
    <t-card class="list-card-container" :bordered="false" style="margin-top: var(--td-comp-margin-l)">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="opOnClickRefresh"> {{ t('pages.apisixPlugin.operations.refresh') }} </t-button>
          <t-button theme="danger" @click="opOnClickReload"> {{ t('pages.apisixPlugin.operations.reload') }} </t-button>
          <t-button variant="base" theme="default" :disabled="tabSelectedRowKeys.length <= 0" @click="opClickExport">
            {{ t('pages.apisixPlugin.operations.export') }}</t-button
          >
          <p v-if="tabSelectedRowKeys.length > 0" class="selected-count">
            {{ t('pages.apisixPlugin.selectedCount', { num: tabSelectedRowKeys.length }) }}
          </p>
        </div>
        <div class="search-input">
          <t-input v-model="tabSearchValue" :placeholder="t('pages.apisixPlugin.placeholder')" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row>
      <t-table
        v-model:display-columns="DISPLAY_COLUMNS"
        :data="tabData"
        :columns="COLUMNS"
        :column-controller="COLUMN_CONTROLLER"
        :row-key="ROW_PK"
        vertical-align="top"
        :hover="true"
        :pagination="tabPagination"
        :selected-row-keys="tabSelectedRowKeys"
        :loading="tabDataLoading"
        :header-affixed-top="headerAffixedTop"
        table-layout="auto"
        @select-change="tabSelectChange"
      >
        <template #metadata="{ row }: BaseTableCellParams<Row>">
          <t-tag v-if="row.metadata" variant="light-outline" theme="success">
            {{ t('pages.apisixPlugin.root.metadataConfigured') }}
          </t-tag>
        </template>

        <template #op="slotProps: BaseTableCellParams<Row>">
          <t-space>
            <t-link theme="primary" @click="tabRowOnClickView(slotProps)">
              {{ t('pages.apisixPlugin.operations.view') }}</t-link
            >
            <t-link theme="primary" :disabled="!slotProps.row.metadata" @click="tabRowOnClickViewMetadata(slotProps)">
              {{ t('pages.apisixPlugin.operations.viewMetadata') }}</t-link
            >
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="reloadModalVisible"
      :header="t('pages.apisixPlugin.reloadConfirm.header')"
      @confirm="reloadModalOnConfirm"
    >
      <p>{{ t('pages.apisixPlugin.reloadConfirm.content') }}</p>
    </t-dialog>

    <t-drawer v-model:visible="viewDrawerVisible" :header="viewDrawerHeader" size="medium">
      <code-editor v-model:value="viewDrawerContent" language="json" :options="{ readOnly: true }" />
      <template #footer>
        <t-button theme="primary" @click="viewDrawerVisible = false">
          {{ t('pages.apisixPlugin.viewConfirm') }}
        </t-button>
      </template>
    </t-drawer>

    <t-drawer v-model:visible="viewMetadataDrawerVisible" :header="viewMetadataDrawerHeader" size="medium">
      <code-editor v-model:value="viewMetadataDrawerContent" language="json" :options="{ readOnly: true }" />
      <template #footer>
        <t-button theme="primary" @click="viewMetadataDrawerVisible = false">
          {{ t('pages.apisixPlugin.viewMetadataConfirm') }}
        </t-button>
      </template>
    </t-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ApisixPlugin',
};
</script>

<script setup lang="ts">
import { SearchIcon } from 'tdesign-icons-vue-next';
import { BaseTableCellParams, MessagePlugin, TableProps } from 'tdesign-vue-next';
import { computed, onActivated, ref } from 'vue';

import CodeEditor from '@/components/code-editor/index.vue';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useSettingStore } from '@/store';

import type { Row, RowPK } from './table';
import { COLUMN_CONTROLLER, COLUMNS, DISPLAY_COLUMNS, fetchData, reloadPlugins, ROW_PK } from './table';

onActivated(() => {
  tabRefresh();
});

// #region Table

const tabPagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});
const tabSearchValue = ref('');
const tabData = ref<Row[]>([]);
const tabDataLoading = ref(false);
const tabSelectedRowKeys = ref<RowPK[]>([]);

const tabSelectChange: TableProps['onSelectChange'] = (selectedRowKey, options) => {
  tabSelectedRowKeys.value = selectedRowKey.slice() as RowPK[];
};

const tabRefresh = async () => {
  tabDataLoading.value = true;
  try {
    const resData = await fetchData(undefined, tabPagination.value);
    tabData.value = resData.list;
    tabPagination.value = {
      ...tabPagination.value,
      total: resData.total,
    };
  } catch (e) {
    console.error(e);
  }
  tabDataLoading.value = false;
};

// #endregion Table

// #region Export

const opClickExport = () => {
  // TODO
};

// #endregion Export

// #region View

const viewDrawerVisible = ref(false);
const viewDrawerHeader = ref('');
const viewDrawerContent = ref('');

const tabRowOnClickView = (slotProps: BaseTableCellParams<Row>) => {
  viewDrawerHeader.value = slotProps.row.name;
  viewDrawerContent.value = JSON.stringify(slotProps.row.value, null, 2);
  viewDrawerVisible.value = true;
};

// #endregion View

// #region Refresh

const opOnClickRefresh = () => {
  tabRefresh();
};

// #endregion Refresh

// #region Reload

const reloadModalVisible = ref(false);

const opOnClickReload = async () => {
  reloadModalVisible.value = true;
};

const reloadModalOnConfirm = async () => {
  try {
    await reloadPlugins();
  } catch (error) {
    MessagePlugin.error('Failed to reload plugins:', error);
  }
  reloadModalVisible.value = false;
  MessagePlugin.success(t('pages.apisixPlugin.reloadMessage.success'));

  await tabRefresh();
};

// #endregion Reload

// #region View Metadata

const viewMetadataDrawerVisible = ref(false);
const viewMetadataDrawerHeader = ref('');
const viewMetadataDrawerContent = ref('');

const tabRowOnClickViewMetadata = (slotProps: BaseTableCellParams<Row>) => {
  viewMetadataDrawerHeader.value = `${slotProps.row.name} ${t('pages.apisixPlugin.root.metadata')}`;
  viewMetadataDrawerContent.value = JSON.stringify(slotProps.row.metadata, null, 2);
  viewMetadataDrawerVisible.value = true;
};

// #endregion View Metadata

const settingsStore = useSettingStore();
const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: settingsStore.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);
</script>

<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}

.list-card-container {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__body) {
    padding: 0;
  }
}

.left-operation-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--td-comp-margin-xxl);

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-l);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>
