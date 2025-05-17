import { Mutable } from '@vueuse/core';
import { PaginationProps, TableProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { PluginApi, PluginMetadataApi } from '@/api/apisix/admin';
import {
  ApisixAdminPluginMetadataGet200ResponseListInner,
  ApisixAdminPluginsGet200Response,
  PluginApiApisixAdminPluginsGetRequest,
} from '@/api/apisix/admin/typescript-axios';
import { t } from '@/locales';

// #region Table Columns

/**
 * 表格行的数据类型
 */
export type Row = {
  /**
   * Response是一个Object，根据这个object重新构建一个Row结构
   * key 提取至 name
   * value 提取至 value
   * configuredMetadata 通过 plugin_metadata 接口获得
   */
  [K in keyof ApisixAdminPluginsGet200Response]: {
    /**
     * 插件名称，唯一
     */
    name: K;
    /**
     * 插件信息
     */
    value: ApisixAdminPluginsGet200Response[K];
    /**
     * 已配置的插件元数据 通过 plugin_metadata 接口获得
     */
    metadata: ApisixAdminPluginMetadataGet200ResponseListInner['value'];
  };
}[keyof ApisixAdminPluginsGet200Response];
/**
 * 表格行的主键键名
 */
export const ROW_PK: keyof Row = 'name';
/**
 * 表格行的主键类型
 */
export type RowPK = Row[typeof ROW_PK];

export type Column = TableProps['columns'] & {
  defaultHidden?: boolean;
  canModifyHidden?: boolean;
};

export const COLUMNS: TableProps['columns'] = [
  { colKey: 'row-select', type: 'multiple', width: 64, fixed: 'left' },
  {
    title: t('pages.apisixPlugin.root.name'),
    colKey: 'name',
    fixed: 'left',
  },
  {
    title: t('pages.apisixPlugin.root.metadata'),
    colKey: 'metadata',
  },
  {
    title: t('pages.apisixPlugin.value.priority'),
    colKey: 'value.priority',
  },
  {
    title: t('pages.apisixPlugin.value.version'),
    colKey: 'value.version',
  },
  {
    title: t('pages.apisixPlugin.value.scope'),
    colKey: 'value.scope',
  },
  {
    title: t('pages.apisixPlugin.value.type'),
    colKey: 'value.type',
  },
  {
    title: t('pages.apisixPlugin.operation'),
    align: 'left',
    fixed: 'right',
    colKey: 'op',
    width: 160,
  },
];

/**
 * 固定展示列
 */
const FIXED_DISPLAY_COLUMNS: string[] = ['row-select', 'op'];

/**
 * 展示列
 */
export const DISPLAY_COLUMNS = ref<TableProps['displayColumns']>([
  ...FIXED_DISPLAY_COLUMNS,
  'name',
  'metadata',
  'value.priority',
  'value.version',
  'value.scope',
  'value.type',
]);

export const COLUMN_CONTROLLER = ref<TableProps['columnController']>({
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
      columns: ['name', 'metadata'],
    },
    {
      label: 'value',
      value: 'value',
      columns: ['value.priority', 'value.version', 'value.scope', 'value.type'],
    },
  ],
});

// #endregion Table Columns

// #region Table Data Action

// 筛选器表单的数据类型
export type SearchFormData = Mutable<PluginApiApisixAdminPluginsGetRequest>;

export const fetchData = async (searchFormData: SearchFormData, _paginationInfo: PaginationProps) => {
  try {
    // TODO 等待 apisix #12165
    // 这里说要弃用：https://apisix.apache.org/zh/docs/apisix/admin-api/#plugin-request-methods
    // 这里说要改进：https://github.com/apache/apisix/issues/12165
    const res = await PluginApi.apisixAdminPluginsGet({
      all: true,
      ...searchFormData,
      // NOTE: admin api not support pagination
      // params: {
      //   page: paginationInfo.current,
      //   page_size: paginationInfo.pageSize,
      // },
    });

    // Transform to UI data
    const list: Array<Row> = Object.entries(res.data)
      .map(([key, value]) => {
        return {
          name: key as keyof ApisixAdminPluginsGet200Response,
          value,
        } as Row;
      })
      .sort((a, b) => a.value.priority - b.value.priority);

    // fetch metadata
    const metadataRes = await PluginMetadataApi.apisixAdminPluginMetadataGet();
    list.forEach((item) => {
      // TODO 需要测试
      item.metadata = metadataRes.data.list.find((e) => e.key === item.name)?.value;
    });

    const uiResData = {
      list,
      total: list.length,
    };

    return uiResData;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

// #endregion Table Data Action

export const reloadPlugins = async () => {
  try {
    const res = await PluginApi.apisixAdminPluginsReloadPut();
    return res.data;
  } catch (error) {
    console.error('Failed to reload plugins:', error);
    throw error;
  }
};
