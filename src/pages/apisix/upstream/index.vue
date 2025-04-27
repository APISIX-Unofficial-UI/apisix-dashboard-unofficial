<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="opOnClickRefresh"> {{ t('pages.apisixUpstream.operations.refresh') }} </t-button>
          <t-button @click="opClickCreate"> {{ t('pages.apisixUpstream.operations.create') }} </t-button>
          <t-button theme="danger" :disabled="tabSelectedRowKeys.length <= 0" @click="opOnClickDelete">
            {{ t('pages.apisixUpstream.operations.delete') }}
          </t-button>
          <t-button variant="base" theme="default" :disabled="tabSelectedRowKeys.length <= 0" @click="opClickExport">
            {{ t('pages.apisixUpstream.operations.export') }}</t-button
          >
          <p v-if="tabSelectedRowKeys.length > 0" class="selected-count">
            {{ t('pages.apisixUpstream.selectedCount', { num: tabSelectedRowKeys.length }) }}
          </p>
        </div>
        <div class="search-input">
          <t-input v-model="tabSearchValue" :placeholder="t('pages.apisixUpstream.placeholder')" clearable>
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
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.create_time="{ row }: BaseTableCellParams<Row>">
          {{ dayjs.unix(row.value.create_time).format('L LT') }}
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.update_time="{ row }: BaseTableCellParams<Row>">
          {{ dayjs.unix(row.value.update_time).format('L LT') }}
        </template>

        <template #op="slotProps: BaseTableCellParams<Row>">
          <t-space>
            <t-link theme="primary" @click="tabRowOnClickView(slotProps)">
              {{ t('pages.apisixUpstream.operations.view') }}</t-link
            >
            <t-link theme="primary" @click="tabRowOnClickEdit(slotProps)">
              {{ t('pages.apisixUpstream.operations.edit') }}</t-link
            >
            <t-link theme="danger" @click="tabRowOnClickDelete(slotProps)">
              {{ t('pages.apisixUpstream.operations.delete') }}</t-link
            >
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="delModalVisible"
      :header="t('pages.apisixUpstream.deleteConfirm.header')"
      :on-cancel="delModalOnCancel"
      @confirm="delModalOnConfirm"
    >
      <p v-if="toDelRowKeys.length === 1">
        {{
          t('pages.apisixUpstream.deleteConfirm.deleteOne', {
            name: tabData.find((e) => e.key === toDelRowKeys[0])?.value?.id,
          })
        }}
      </p>
      <p v-if="toDelRowKeys.length > 1">
        {{
          t('pages.apisixUpstream.deleteConfirm.deleteMulti', {
            name: tabData.find((e) => e.key === toDelRowKeys[0])?.value?.id,
            num: toDelRowKeys.length,
          })
        }}
      </p>
    </t-dialog>

    <t-drawer v-model:visible="viewDrawerVisible" :header="viewDrawerHeader" size="medium">
      <code-editor v-model:value="viewDrawerContent" language="json" />
    </t-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ApisixUpstream',
};
</script>

<script setup lang="ts">
import dayjs from 'dayjs';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { BaseTableCellParams, MessagePlugin, TableProps } from 'tdesign-vue-next';
import { computed, onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';

import { ApisixAdminRoutesIdDelete200Response } from '@/api/apisix/admin/typescript-axios';
import CodeEditor from '@/components/code-editor/index.vue';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useSettingStore } from '@/store';

import type { Row, RowPK } from './table';
import { COLUMN_CONTROLLER, COLUMNS, deleteRow, DISPLAY_COLUMNS, fetchData, ROW_PK } from './table';

onActivated(() => {
  tabRefresh();
});

const router = useRouter();

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

// #region Delete

const toDelRowKeys = ref<RowPK[]>([]);
const delModalVisible = ref(false);

const delReset = () => {
  toDelRowKeys.value = [];
};

const delModalOnCancel = () => {
  delReset();
};

const delModalOnConfirm = async () => {
  const ps: Promise<ApisixAdminRoutesIdDelete200Response>[] = [];
  toDelRowKeys.value.forEach((rowKey) => {
    const row = tabData.value.find((e) => e.key === rowKey);
    const p = deleteRow(row);
    ps.push(p);
  });
  const resDataArr = await Promise.all(ps); // TODO: 报告成功和失败情况

  const successResDataArr = resDataArr.filter((d) => d.deleted);

  delReset();
  delModalVisible.value = false;
  MessagePlugin.success(t('pages.apisixUpstream.deleteMessage.success', { num: successResDataArr.length }));

  await tabRefresh();
};

const opOnClickDelete = () => {
  toDelRowKeys.value = tabSelectedRowKeys.value.slice();
  delModalVisible.value = true;
};

const tabRowOnClickDelete = (slotProps: BaseTableCellParams<Row>) => {
  toDelRowKeys.value = [slotProps.row.key];
  delModalVisible.value = true;
};

// #endregion Delete

// #region Create

const opClickCreate = () => {
  router.push('/apisix/upstream/edit');
};

// #endregion Create

// #region Edit

const tabRowOnClickEdit = (slotProps: BaseTableCellParams<Row>) => {
  router.push(`/apisix/upstream/edit?id=${slotProps.row.value.id}`);
};

// #endregion Edit

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
  viewDrawerHeader.value = slotProps.row.value.id as string;
  viewDrawerContent.value = JSON.stringify(slotProps.row.value, null, 2);
  viewDrawerVisible.value = true;
};

// #endregion View

// #region Refresh

const opOnClickRefresh = () => {
  tabRefresh();
};

// #endregion Refresh

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
