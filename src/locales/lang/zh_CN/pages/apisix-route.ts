export default {
  title: '路由列表',
  description:
    '路由（Route）是请求的入口点，它定义了客户端请求与服务之间的匹配规则。路由可以与服务（Service）、上游（Upstream）关联，一个服务可对应一组路由，一个路由可以对应一个上游对象（一组后端服务节点），因此，每个匹配到路由的请求将被网关代理到路由绑定的上游服务中。',
  selectedCount: '已选 {num} 项',
  placeholder: '请输入内容搜索TODO',
  viewConfirm: '确定',
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
    header: '确认删除当前所选路由？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个路由？',
  },
  deleteMessage: {
    success: '已删除 {num} 个路由',
  },
  root: {
    key: 'key',
    createdIndex: 'createdIndex',
    modifiedIndex: 'modifiedIndex',
  },
  value: {
    name: '名称',
    id: 'ID',
    host: '域名',
    uri: '路径',
    desc: '描述',
    labels: '标签',
    API_VERSION: '路由版本',
    status: '状态',
    statusEnum: {
      0: '未发布',
      1: '已发布',
    },
    plugins: '插件',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
