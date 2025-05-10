export default {
  title: '上游列表',
  description: '上游列表包含了已创建的上游服务（即后端服务），可以对上游服务的多个目标节点进行负载均衡和健康检查。',
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
    header: '确认删除当前所选上游？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个上游？',
  },
  deleteMessage: {
    success: '已删除 {num} 个上游',
  },
  root: {
    key: 'key',
    createdIndex: 'createdIndex',
    modifiedIndex: 'modifiedIndex',
  },
  value: {
    id: 'ID',
    name: '名称',
    desc: '描述',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
