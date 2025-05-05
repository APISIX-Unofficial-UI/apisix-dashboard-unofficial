export default {
  title: '证书列表',
  description: '证书被网关用于处理加密请求，它将与 SNI 关联，并与路由中主机名绑定。',
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
    header: '确认删除当前所选 SSL？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个 SSL？',
  },
  deleteMessage: {
    success: '已删除 {num} 个 SSL',
  },
  root: {
    key: 'key',
    createdIndex: 'createdIndex',
    modifiedIndex: 'modifiedIndex',
  },
  value: {
    id: 'ID',
    sni: 'SNI',
    expireTime: '过期时间',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
