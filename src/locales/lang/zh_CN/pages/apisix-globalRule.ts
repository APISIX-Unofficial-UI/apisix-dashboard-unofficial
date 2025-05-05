export default {
  title: '全局规则',
  description: `Plugin 配置可直接绑定在 Route 上，也可以被绑定在 Service 或 Consumer 上。
如果你需要一个能作用于所有请求的 Plugin，可以通过 Global Rules 启用一个全局的插件配置。
全局规则相对于 Route、Service、Plugin Config、Consumer 中的插件配置，Global Rules 中的插件总是优先执行。`,
  selectedCount: '已选 {num} 项',
  placeholder: '请输入内容搜索TODO',
  operation: '操作',
  operations: {
    refresh: '刷新',
    export: '导出TODO',
    create: '新建',
    view: '查看',
    edit: '编辑',
    delete: '删除',
  },
  deleteConfirm: {
    header: '确认删除当前所选规则？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个规则？',
  },
  deleteMessage: {
    success: '已删除 {num} 个规则',
  },
  root: {
    key: 'key',
    createdIndex: 'createdIndex',
    modifiedIndex: 'modifiedIndex',
  },
  value: {
    id: 'ID',
    plugins: '插件',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
