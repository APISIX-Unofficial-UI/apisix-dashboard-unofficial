export default {
  title: '服务列表',
  description:
    '服务由路由中公共的插件配置、上游目标信息组合而成。服务与路由、上游关联，一个服务可对应一组上游节点、可被多条路由绑定。',
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
    header: '确认删除当前所选服务？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个服务？',
  },
  deleteMessage: {
    success: '已删除 {num} 个服务',
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
    labels: '标签',
    upstream_id: '上游ID',
    upstream: '上游',
    plugins: '插件',
    enable_websocket: 'WebSocket',
    script: '脚本',
    hosts: '域名',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
