<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="handleCreate"> {{ t('pages.apisixRoute.create') }} </t-button>
          <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length">
            {{ t('pages.apisixRoute.export') }}</t-button
          >
          <p v-if="!!selectedRowKeys.length" class="selected-count">
            {{ t('pages.apisixRoute.selectedCount', { num: selectedRowKeys.length }) }}
          </p>
        </div>
        <div class="search-input">
          <t-input v-model="searchValue" :placeholder="t('pages.apisixRoute.placeholder')" clearable>
            <template #suffix-icon>
              <search-icon size="16px" />
            </template>
          </t-input>
        </div>
      </t-row>
      <t-table
        v-model:display-columns="displayColumns"
        :data="data"
        :columns="COLUMNS"
        :column-controller="columnControllerConfig"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        table-layout="auto"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="(value: string[]) => rehandleSelectChange(value)"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.labels="{ row }">
          <t-space size="small">
            <t-tag v-for="(value, key) in row.value.labels" :key="key" variant="light-outline">
              {{ key }}:{{ value }}
            </t-tag>
          </t-space>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.status="{ row }">
          <t-switch
            v-model="row.value.status"
            size="large"
            :custom-value="[1, 0]"
            :label="[t('pages.apisixRoute.value.statusEnum.1'), t('pages.apisixRoute.value.statusEnum.0')]"
            :loading="statusSwitchLoading[row.value.id]"
            @change="
              (value, content) => {
                updateStatus(row.value.id, value);
              }
            "
          />
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.plugins="{ row }">
          <t-space size="small">
            <t-tag v-for="(value, key) in row.value.plugins" :key="key" variant="light-outline">
              {{ key }}
            </t-tag>
          </t-space>
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.create_time="{ row }">
          {{ dayjs.unix(row.value.create_time).format('L LT') }}
        </template>

        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #value.update_time="{ row }">
          {{ dayjs.unix(row.value.update_time).format('L LT') }}
        </template>

        <template #op="slotProps: BaseTableCellParams<Item>">
          <t-space>
            <t-link theme="primary" @click="handleClickView(slotProps)">
              {{ t('pages.apisixRoute.operations.view') }}</t-link
            >
            <t-link theme="primary" @click="handleClickEdit(slotProps)">
              {{ t('pages.apisixRoute.operations.edit') }}</t-link
            >
            <t-link theme="danger" @click="handleClickDelete(slotProps)">
              {{ t('pages.apisixRoute.operations.delete') }}</t-link
            >
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="confirmVisible"
      :header="t('pages.apisixRoute.deleteConfirm.header')"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    >
      <p v-if="deleteIdx.length === 1">
        {{
          t('pages.apisixRoute.deleteConfirm.deleteOne', {
            name: data[deleteIdx[0]]?.value?.name,
          })
        }}
      </p>
      <p v-if="deleteIdx.length > 1">
        {{
          t('pages.apisixRoute.deleteConfirm.deleteMulti', {
            name: data[deleteIdx[0]]?.value?.name,
            num: deleteIdx.length,
          })
        }}
      </p>
    </t-dialog>

    <t-drawer v-model:visible="drawerVisible" :header="drawerHeader" size="medium">
      <code-editor v-model:value="drawerBody" language="json" :options="{ readOnly: true }" />
      <template #footer>
        <t-button theme="primary" @click="drawerVisible = false">
          {{ t('pages.apisixRoute.viewConfirm') }}
        </t-button>
      </template>
    </t-drawer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ApisixRoute',
};
</script>

<script setup lang="ts">
import { AxiosPromise } from 'axios';
import dayjs from 'dayjs';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { BaseTableCellParams, MessagePlugin, SwitchValue, TableProps } from 'tdesign-vue-next';
import { computed, onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';

import { RouteApi } from '@/api/apisix/admin';
import {
  ApisixAdminRoutesGet200ResponseListInner as Item,
  ApisixAdminRoutesIdDelete200Response,
} from '@/api/apisix/admin/typescript-axios';
import CodeEditor from '@/components/code-editor/index.vue';
import { prefix } from '@/config/global';
import { t } from '@/locales';
import { useSettingStore } from '@/store';

const store = useSettingStore();

const COLUMNS = ref<TableProps['columns']>([
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: t('pages.apisixRoute.root.key'),
    colKey: 'key',
    fixed: 'left',
  },
  {
    title: t('pages.apisixRoute.root.createdIndex'),
    colKey: 'createdIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixRoute.root.modifiedIndex'),
    colKey: 'modifiedIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixRoute.value.name'),
    colKey: 'value.name',
    fixed: 'left',
  },
  {
    title: t('pages.apisixRoute.value.id'),
    colKey: 'value.id',
  },
  {
    title: t('pages.apisixRoute.value.host'),
    colKey: 'value.host',
  },
  {
    title: t('pages.apisixRoute.value.uri'),
    colKey: 'value.uri',
  },
  {
    title: t('pages.apisixRoute.value.desc'),
    colKey: 'value.desc',
  },
  {
    title: t('pages.apisixRoute.value.labels'),
    colKey: 'value.labels',
  },
  // {
  //   title: t('pages.apisixRoute.value.API_VERSION'),
  //   colKey: 'value.API_VERSION',
  // },
  {
    title: t('pages.apisixRoute.value.status'),
    colKey: 'value.status',
  },
  {
    title: t('pages.apisixRoute.value.plugins'),
    colKey: 'value.plugins',
  },
  {
    title: t('pages.apisixRoute.value.create_time'),
    colKey: 'value.create_time',
    width: 240,
  },
  {
    title: t('pages.apisixRoute.value.update_time'),
    colKey: 'value.update_time',
    width: 240,
  },
  {
    title: t('pages.apisixRoute.operation'),
    align: 'left',
    fixed: 'right',
    colKey: 'op',
    width: 160,
  },
]);
const staticColumn: string[] = ['row-select', 'op'];
const displayColumns = ref<TableProps['displayColumns']>(
  staticColumn.concat([
    'value.name',
    'value.id',
    'value.host',
    'value.uri',
    'value.desc',
    'value.labels',
    'value.status',
    'value.plugins',
  ]),
);
const columnControllerConfig = computed<TableProps['columnController']>(() => ({
  // 列配置按钮位置
  placement: 'top-right',
  // 用于设置允许用户对哪些列进行显示或隐藏的控制，默认为全部字段
  fields: undefined,
  // 弹框组件属性透传
  dialogProps: {
    preventScrollThrough: true,
  },
  // 列配置按钮组件属性透传
  buttonProps: undefined,
  // 数据字段分组显示
  groupColumns: [
    {
      label: 'root',
      value: 'root',
      columns: ['key', 'createdIndex', 'modifiedIndex'],
    },
    {
      label: 'value',
      value: 'value',
      columns: [
        'value.name',
        'value.id',
        'value.host',
        'value.uri',
        'value.desc',
        'value.labels',
        'value.status',
        'value.plugins',
        'value.create_time',
        'value.update_time',
      ],
    },
  ],
}));

const data = ref<Item[]>([]);
const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});

const searchValue = ref('');

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const res = await RouteApi.apisixAdminRoutesGet({
      params: {
        page: pagination.value.defaultCurrent,
        page_size: pagination.value.defaultPageSize,
      },
    });
    let { list } = res.data;
    // fix: when apisix returns list as {}
    if (!(list instanceof Array)) {
      list = [];
    }

    data.value = list;
    pagination.value = {
      ...pagination.value,
      total: list.length,
    };
  } catch (e) {
    console.error(e);
  }
  dataLoading.value = false;
};

const deleteIdx = ref<number[]>([]);

onActivated(() => {
  fetchData();
});

const confirmVisible = ref(false);

const selectedRowKeys = ref<string[]>([]);

const router = useRouter();

const resetIdx = () => {
  deleteIdx.value = [];
};

const onConfirmDelete = async () => {
  // 真实业务请发起请求
  const ps: AxiosPromise<ApisixAdminRoutesIdDelete200Response>[] = [];
  deleteIdx.value.forEach((rowIndex) => {
    const { id } = data.value[rowIndex].value;
    const p = RouteApi.apisixAdminRoutesIdDelete({
      id: id.toString(), // fix: apisix openapi
      force: 'false',
    });
    ps.push(p);
  });
  const resArr = await Promise.all(ps);

  const successResArr = resArr.filter((res) => {
    return res.status === 200 && res.data.deleted;
  });

  resetIdx();
  confirmVisible.value = false;
  MessagePlugin.success(t('pages.apisixRoute.deleteMessage.success', { num: successResArr.length }));

  await fetchData();
};

const onCancel = () => {
  resetIdx();
};

const rowKey = 'key';

const rehandleSelectChange = (val: string[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr: unknown, pageInfo: unknown) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams: unknown, triggerAndData: unknown) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickView = (slotProps: BaseTableCellParams<Item>) => {
  drawerHeader.value = slotProps.row.value.name;
  drawerBody.value = JSON.stringify(slotProps.row.value, null, 2);
  drawerVisible.value = true;
};
const handleClickEdit = (slotProps: BaseTableCellParams<Item>) => {
  router.push(`/apisix/route/edit?id=${slotProps.row.value.id}`);
};
const handleCreate = () => {
  router.push('/apisix/route/edit');
};
const handleClickDelete = (slotProps: BaseTableCellParams<Item>) => {
  deleteIdx.value = [slotProps.rowIndex];
  confirmVisible.value = true;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    }) as any,
);

const drawerVisible = ref(false);
const drawerHeader = ref('');
const drawerBody = ref('');

const statusSwitchLoading = ref<Record<string, any>>({});
const updateStatus = async (id: string, status: SwitchValue) => {
  statusSwitchLoading.value[id] = true;
  try {
    const res = await RouteApi.apisixAdminRoutesIdPatch({
      id,
      apisixAdminRoutesPostRequest: {
        status,
      },
    });
  } catch (e) {
    console.error(e);
  }
  statusSwitchLoading.value[id] = false;
  fetchData();
};
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
