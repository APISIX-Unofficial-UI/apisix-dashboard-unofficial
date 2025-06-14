export default {
  // 上游基础信息
  basic: {
    title: '上游基础信息',
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
    hostLabel: 'Host',
    hostPlaceholder: '请输入域名或IP地址',
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
  },

  // 协议配置
  scheme: {
    label: '协议',
    placeholder: '请选择协议',
  },

  // Host Header传递方式
  hostHeader: {
    label: 'Host Header传递方式',
    placeholder: '请选择Host Header传递方式',
    pass: '透传',
    node: '使用节点',
    rewrite: '重写',
    upstreamHostLabel: '重写后的上游Host',
    upstreamHostPlaceholder: '请输入重写后的上游Host',
  },

  // 负载均衡
  loadBalancer: {
    title: '负载均衡',
    label: '负载均衡算法',
    placeholder: '请选择负载均衡算法',
    roundRobin: '带权轮询',
    consistentHash: '一致性哈希',
    ewma: '指数加权平均(EWMA)',
    leastConn: '最少连接数',
  },

  // 重试配置
  retries: {
    title: '重试和超时',
    label: '重试次数',
    placeholder: '请输入重试次数',
  },

  retryTimeout: {
    label: '重试超时',
    placeholder: '请输入重试超时时间',
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
      healthCheckType: '健康检查类型',
      httpPathLabel: 'HTTP检查路径',
      httpPathPlaceholder: '请输入HTTP检查路径',
      httpPathRequired: '请填写HTTP检查路径',
      hostLabel: 'Host Header',
      hostPlaceholder: '请输入Host Header',
      hostRequired: '请填写Host Header',
      timeoutLabel: '检查超时时间',
      timeoutPlaceholder: '请输入检查超时时间',
      concurrencyLabel: '并发检查数',
      concurrencyPlaceholder: '请输入并发检查数',
      portLabel: '检查端口',
      portPlaceholder: '请输入检查端口',
      httpsVerifyCertificateLabel: '验证SSL证书',
      healthy: {
        title: '健康判定条件',
        intervalLabel: '检查间隔',
        intervalPlaceholder: '请输入健康检查间隔时间',
        intervalRequired: '请填写健康检查间隔时间',
        successesLabel: '成功次数',
        successesPlaceholder: '请输入判定为健康所需的成功次数',
        successesRequired: '请填写健康判定所需的成功次数',
        httpStatusesLabel: 'HTTP状态码',
        httpStatusesPlaceholder: '输入HTTP状态码并回车',
      },
      unhealthy: {
        title: '不健康判定条件',
        intervalLabel: '检查间隔',
        intervalPlaceholder: '请输入不健康检查间隔时间',
        intervalRequired: '请填写不健康检查间隔时间',
        httpFailuresLabel: 'HTTP失败次数',
        httpFailuresPlaceholder: '请输入判定为不健康所需的HTTP失败次数',
        httpFailuresRequired: '请填写不健康判定所需的HTTP失败次数',
        tcpFailuresLabel: 'TCP失败次数',
        tcpFailuresPlaceholder: '请输入判定为不健康所需的TCP失败次数',
        timeoutsLabel: '超时次数',
        timeoutsPlaceholder: '请输入判定为不健康所需的超时次数',
        httpStatusesLabel: 'HTTP状态码',
        httpStatusesPlaceholder: '输入HTTP状态码并回车',
      },
    },
  },

  // 警告信息
  warnings: {
    invalidNodeFormat: '节点格式无效',
    invalidHttpStatusCode: 'HTTP状态码必须是200-599之间的数字',
  },
};
