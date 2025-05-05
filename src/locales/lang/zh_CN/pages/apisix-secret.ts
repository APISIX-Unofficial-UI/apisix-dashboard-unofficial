export default {
  title: '密钥管理器',
  description: `密钥是指 APISIX 运行过程中所需的任何敏感信息，它可能是核心配置的一部分（如 etcd 的密码），也可能是插件中的一些敏感信息。APISIX 中常见的密钥类型包括：
1. 一些组件（etcd、Redis、Kafka 等）的用户名、密码;
2. 证书的私钥;
3. API 密钥;
4. 敏感的插件配置字段，通常用于身份验证、hash、签名或加密;
APISIX Secret 允许用户在 APISIX 中通过一些密钥管理服务（Vault 等）来存储密钥，在使用的时候根据 key 进行读取，确保密钥在整个平台中不以明文的形式存在。`,
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
    header: '确认删除当前所选密钥管理器？',
    deleteOne: '确认删除"{name}"？',
    deleteMulti: '确认删除"{name}"等 {num} 个密钥管理器？',
  },
  deleteMessage: {
    success: '已删除 {num} 个密钥管理器',
  },
  root: {
    key: 'key',
    createdIndex: 'createdIndex',
    modifiedIndex: 'modifiedIndex',
  },
  value: {
    id: 'ID',
    secretManager: 'SecretManager',
    name: '名称',
    uri: 'Uri',
    prefix: 'Prefix',
    token: 'Token',
    create_time: '创建时间',
    update_time: '更新时间',
  },
};
