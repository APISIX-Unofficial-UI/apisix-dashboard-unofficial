import { Mutable } from '@vueuse/core';
import { PaginationProps, TableProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { ServiceApi } from '@/api/apisix/admin';
import { ApisixAdminServicesGet200ResponseListInner } from '@/api/apisix/admin/typescript-axios';
import { t } from '@/locales';

// #region Table Columns

/**
 * 表格行的数据类型
 */
export type Row = ApisixAdminServicesGet200ResponseListInner;
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
    title: t('pages.apisixService.root.key'),
    colKey: 'key',
    fixed: 'left',
  },
  {
    title: t('pages.apisixService.root.createdIndex'),
    colKey: 'createdIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixService.root.modifiedIndex'),
    colKey: 'modifiedIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixService.value.id'),
    colKey: 'value.id',
    fixed: 'left',
  },
  {
    title: t('pages.apisixService.value.name'),
    colKey: 'value.name',
  },
  {
    title: t('pages.apisixService.value.desc'),
    colKey: 'value.desc',
  },
  {
    title: t('pages.apisixService.value.labels'),
    colKey: 'value.labels',
  },
  {
    title: t('pages.apisixService.value.upstream_id'),
    colKey: 'value.upstream_id',
  },
  {
    title: t('pages.apisixService.value.upstream'),
    colKey: 'value.upstream',
  },
  {
    title: t('pages.apisixService.value.plugins'),
    colKey: 'value.plugins',
  },
  {
    title: t('pages.apisixService.value.enable_websocket'),
    colKey: 'value.enable_websocket',
  },
  {
    title: t('pages.apisixService.value.script'),
    colKey: 'value.script',
  },
  {
    title: t('pages.apisixService.value.hosts'),
    colKey: 'value.hosts',
  },
  {
    title: t('pages.apisixService.value.create_time'),
    colKey: 'value.create_time',
    width: 240,
  },
  {
    title: t('pages.apisixService.value.update_time'),
    colKey: 'value.update_time',
    width: 240,
  },
  {
    title: t('pages.apisixService.operation'),
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
  'value.name',
  'value.desc',
  'value.labels',
  'value.plugins',
  'value.enable_websocket',
  'value.hosts',
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
        'value.name',
        'value.desc',
        'value.labels',
        'value.upstream_id',
        'value.upstream',
        'value.plugins',
        'value.enable_websocket',
        'value.script',
        'value.hosts',
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
    const res = await ServiceApi.apisixAdminServicesGet({
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
    const res = await ServiceApi.apisixAdminServicesIdDelete({
      // id: row.value.id,
      id: row.value.id as string, // fix: apisix openapi is empty interface
      force: 'false',
    });
    return res.data;
  } catch (error) {
    console.error('Failed to delete row:', error);
    throw error;
  }
};

// #endregion Table Data Action
