import { Mutable } from '@vueuse/core';
import { PaginationProps, TableProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { GlobalRuleApi } from '@/api/apisix/admin';
import { ApisixAdminGlobalRulesGet200ResponseListInner } from '@/api/apisix/admin/typescript-axios';
import { t } from '@/locales';

// #region Table Columns

/**
 * 表格行的数据类型
 */
export type Row = ApisixAdminGlobalRulesGet200ResponseListInner;
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
    title: t('pages.apisixGlobalRule.root.key'),
    colKey: 'key',
    fixed: 'left',
  },
  {
    title: t('pages.apisixGlobalRule.root.createdIndex'),
    colKey: 'createdIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixGlobalRule.root.modifiedIndex'),
    colKey: 'modifiedIndex',
    fixed: 'left',
  },
  {
    title: t('pages.apisixGlobalRule.value.id'),
    colKey: 'value.id',
    fixed: 'left',
  },
  {
    title: t('pages.apisixGlobalRule.value.plugins'),
    colKey: 'value.plugins',
  },
  {
    title: t('pages.apisixGlobalRule.value.create_time'),
    colKey: 'value.create_time',
    width: 240,
  },
  {
    title: t('pages.apisixGlobalRule.value.update_time'),
    colKey: 'value.update_time',
    width: 240,
  },
  {
    title: t('pages.apisixGlobalRule.operation'),
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
  'value.desc',
  'value.content',
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
      columns: ['value.id', 'value.plugins', 'value.create_time', 'value.update_time'],
    },
  ],
});

// #endregion Table Columns

// #region Table Data Action

// 筛选器表单的数据类型
export type SearchFormData = Mutable<void>; // TODO

export const fetchData = async (searchFormData: SearchFormData, paginationInfo: PaginationProps) => {
  try {
    const res = await GlobalRuleApi.apisixAdminGlobalRulesGet({
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
    const res = await GlobalRuleApi.apisixAdminGlobalRulesIdDelete({
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
