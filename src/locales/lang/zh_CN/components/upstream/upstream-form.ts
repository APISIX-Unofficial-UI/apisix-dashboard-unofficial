export default {
  // 负载均衡
  loadBalancer: {
    label: '负载均衡算法',
    placeholder: '请选择负载均衡算法',
    roundRobin: '带权轮询',
    consistentHash: '一致性哈希',
    ewma: '指数加权平均(EWMA)',
    leastConn: '最少连接数',
  },

  // 上游类型
  upstreamType: {
    label: '上游类型',
    nodes: '节点列表',
    discovery: '服务发现',
  },

  // 节点配置
  nodes: {
    label: '节点配置',
    hostLabel: '主机',
    hostPlaceholder: '请输入主机名或IP地址',
    portLabel: '端口',
    portPlaceholder: '请输入端口号',
    weightLabel: '权重',
    weightPlaceholder: '请输入权重',
    addNode: '添加节点',
    removeNode: '移除节点',
  },

  // 服务发现配置
  discovery: {
    typeLabel: '服务发现类型',
    typePlaceholder: '请选择服务发现类型',
    serviceNameLabel: '服务名称',
    serviceNamePlaceholder: '请输入服务名称',
    hostHeaderLabel: '主机头传递方式',
    hostHeaderPlaceholder: '请选择主机头传递方式',
    hostHeaderPass: '透传',
    hostHeaderNode: '使用节点',
    hostHeaderRewrite: '重写',
    upstreamHostLabel: '上游主机名',
    upstreamHostPlaceholder: '请输入上游主机名',
  },

  // 重试配置
  retries: {
    label: '重试次数',
    placeholder: '请输入重试次数',
  },

  retryTimeout: {
    label: '重试超时',
    placeholder: '请输入重试超时时间',
  },

  // 协议配置
  protocol: {
    label: '协议',
    placeholder: '请选择协议',
  },

  // 连接超时配置
  connectTimeout: {
    label: '连接超时',
    placeholder: '请输入连接超时时间',
  },

  sendTimeout: {
    label: '发送超时',
    placeholder: '请输入发送超时时间',
  },

  receiveTimeout: {
    label: '接收超时',
    placeholder: '请输入接收超时时间',
  },

  // 连接池配置
  connectionPool: {
    title: '连接池设置',
    capacity: {
      label: '连接池容量',
      placeholder: '请输入连接池容量',
    },
    idleTimeout: {
      label: '空闲超时',
      placeholder: '请输入空闲超时时间',
    },
    maxRequests: {
      label: '最大请求数',
      placeholder: '请输入最大请求数',
    },
  },

  // 健康检查配置
  healthCheck: {
    title: '健康检查',
    active: {
      enableLabel: '启用主动健康检查',
      httpPathLabel: 'HTTP检查路径',
      httpPathPlaceholder: '请输入HTTP检查路径',
      hostLabel: '主机名',
      hostPlaceholder: '请输入主机名',
      healthy: {
        title: '健康判定条件',
        intervalLabel: '检查间隔',
        intervalPlaceholder: '请输入健康检查间隔时间',
        successesLabel: '成功次数',
        successesPlaceholder: '请输入判定为健康所需的成功次数',
      },
      unhealthy: {
        title: '不健康判定条件',
        intervalLabel: '检查间隔',
        intervalPlaceholder: '请输入不健康检查间隔时间',
        httpFailuresLabel: 'HTTP失败次数',
        httpFailuresPlaceholder: '请输入判定为不健康所需的HTTP失败次数',
      },
    },
  },

  // 警告信息
  warnings: {
    invalidNodeFormat: '节点格式无效：{entry}',
  },
};
