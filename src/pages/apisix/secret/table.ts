import { Mutable } from '@vueuse/core';
import { PaginationProps, TableProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { SecretApi } from '@/api/apisix/admin';
import {
  ApisixAdminSecretsGet200ResponseListInner,
  ApisixAdminSecretsSecretmanagerIdGetSecretmanagerParameter,
} from '@/api/apisix/admin/typescript-axios';
import { t } from '@/locales';

// #region Table Columns

/**
 * 表格行的数据类型
 */
export type Row = ApisixAdminSecretsGet200ResponseListInner;
/**
 * 表格行的主键键名
 */
export const ROW_PK: keyof Row = 'key';
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
    title: t('pages.apisixSecret.root.key'),
    colKey: 'key',
    fixed: 'left',
  },
  {
    title: t('pages.apisixSecret.root.createdIndex'),
    colKey: 'createdIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixSecret.root.modifiedIndex'),
    colKey: 'modifiedIndex',
    fixed: 'left',
  },
  // <!-- API 接口的id字段格式是 "{secretmanager}/{id}" 这里是接口原始字段 -->
  {
    title: t('pages.apisixSecret.value.id'),
    colKey: 'value.id',
    fixed: 'left',
  },
  {
    title: t('pages.apisixSecret.value.secretManager'),
    colKey: 'value.secretManager',
  },
  {
    title: t('pages.apisixSecret.value.name'),
    colKey: 'value.name',
  },
  {
    title: t('pages.apisixSecret.value.uri'),
    colKey: 'value.uri',
  },
  {
    title: t('pages.apisixSecret.value.prefix'),
    colKey: 'value.prefix',
  },
  {
    title: t('pages.apisixSecret.value.token'),
    colKey: 'value.token',
  },
  {
    title: t('pages.apisixSecret.value.create_time'),
    colKey: 'value.create_time',
    width: 240,
  },
  {
    title: t('pages.apisixSecret.value.update_time'),
    colKey: 'value.update_time',
    width: 240,
  },
  {
    title: t('pages.apisixSecret.operation'),
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
  'value.id',
  'value.secretManager',
  'value.name',
  'value.uri',
  'value.prefix',
  'value.token',
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
      columns: ['key', 'createdIndex', 'modifiedIndex'],
    },
    {
      label: 'value',
      value: 'value',
      columns: [
        'value.id',
        'value.secretManager',
        'value.name',
        'value.uri',
        'value.prefix',
        'value.token',
        'value.create_time',
        'value.update_time',
      ],
    },
  ],
});

// #endregion Table Columns

// #region Table Data Action

// 筛选器表单的数据类型
export type SearchFormData = Mutable<void>; // TODO

export const fetchData = async (searchFormData: SearchFormData, paginationInfo: PaginationProps) => {
  try {
    const res = await SecretApi.apisixAdminSecretsGet({
      params: {
        page: paginationInfo.current,
        page_size: paginationInfo.pageSize,
      },
    });

    // fix: when empty, apisix returns list as {}
    if (res.data.total === 0 && !(res.data.list instanceof Array)) {
      res.data.list = [];
    }
    return res.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};

export const deleteRow = async (row: Row) => {
  try {
    // <!-- API 接口的id字段格式是 "{secretmanager}/{id}" 这里做拆分 -->
    const [secretmanager, id] = row.value.id.split('/', 2);

    const res = await SecretApi.apisixAdminSecretsSecretmanagerIdDelete({
      secretmanager: secretmanager as ApisixAdminSecretsSecretmanagerIdGetSecretmanagerParameter, // fix: apisix openapi is empty interface
      id,
      force: 'false',
    });
    return res.data;
  } catch (error) {
    console.error('Failed to delete row:', error);
    throw error;
  }
};

// #endregion Table Data Action
