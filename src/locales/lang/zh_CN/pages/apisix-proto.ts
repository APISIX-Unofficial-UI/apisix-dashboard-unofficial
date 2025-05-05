export default {
  title: 'Proto 列表',
  description:
    'Protocol Buffers 是 Google 用于序列化结构化数据的框架，它具有语言中立、平台中立、可扩展机制的特性，您只需定义一次数据的结构化方式，然后就可以使用各种语言通过特殊生成的源代码轻松地将结构化数据写入和读取各种数据流。Protocol Buffers 列表包含了已创建的 proto 文件，在启用 grpc-transcode 插件时可配置 ID 读取对应的 proto 文件内容。',
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
    header: '确认删除当前所选 Proto？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个 Proto？',
  },
  deleteMessage: {
    success: '已删除 {num} 个 Proto',
  },
  root: {
    key: 'key',
    createdIndex: 'createdIndex',
    modifiedIndex: 'modifiedIndex',
  },
  value: {
    id: 'ID',
    desc: '描述',
    content: '内容',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
