<template>
  <div style="padding: 30px; max-width: 800px; margin: auto">
    <h1>Upstream 表单测试页面</h1>

    <t-card title="表单实例">
      <upstream-form ref="upstreamFormRef" v-model="formData" />
    </t-card>

    <t-card title="操作" style="margin-top: 20px">
      <t-space direction="vertical" style="width: 100%">
        <t-space>
          <t-button @click="loadInitialData('empty')">加载空数据</t-button>
          <t-button @click="loadInitialData('nodes')">加载node数据</t-button>
          <t-button theme="primary" @click="validateForm">校验表单</t-button>
          <t-button theme="success" @click="showApiData">显示 API 格式数据</t-button>
        </t-space>
        <t-alert v-if="validationResult !== null" :theme="validationResult ? 'success' : 'error'">
          校验结果: {{ validationResult ? '通过' : '失败' }}
        </t-alert>
      </t-space>
    </t-card>
    <t-card title="API 格式化数据 (getApiFormattedData)" style="margin-top: 20px">
      <pre>{{ JSON.stringify(apiFormattedData, null, 2) }}</pre>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';

import UpstreamForm from '@/components/upstream/upstream-form.vue';

const upstreamFormRef = ref<InstanceType<typeof UpstreamForm> | null>(null);

// --- 数据引用 ---
const formData = ref<Record<string, any> | null>(null);
const apiFormattedData = ref<Record<string, any> | null>(null); // 存储 getApiFormattedData 的结果
const validationResult = ref<boolean | null>(null);

// --- 方法 ---
const loadInitialData = (type: 'nodes' | 'discovery' | 'empty') => {
  validationResult.value = null;
  apiFormattedData.value = null;
  if (type === 'nodes') {
    formData.value = {
      type: 'chash',
      pass_host: 'pass',
      retries: 10,
      retry_timeout: 5,
      scheme: 'https',
      timeout: {
        connect: 151,
        send: 151,
        read: 152,
      },
      keepalive_pool: {
        size: 3200,
        idle_timeout: 601,
        requests: 500,
      },
      checks: {
        active: {
          type: 'http',
          http_path: '/v1/health_check',
          host: '192.168.0.1',
          healthy: {
            interval: 10,
            successes: 5,
            http_statuses: [200, 302],
          },
          unhealthy: {
            interval: 1,
            http_failures: 3,
            http_statuses: [429, 404, 500, 501, 502, 503, 504, 505],
          },
        },
      },
      nodes: {
        '192.168.0.1:1233': 2,
        '192.168.0.2:2333': 4,
      },
    };
  } else if (type === 'discovery') {
    formData.value = {
      /* ... 服务发现示例数据 ... */
    };
  } else {
    upstreamFormRef.value?.resetForm();
  }
  console.log('测试页面: 加载数据', formData.value);
};

const validateForm = async () => {
  if (upstreamFormRef.value) {
    const result = upstreamFormRef.value.validate();
    if (result === false) {
      validationResult.value = false;
      MessagePlugin.error('校验失败');
      console.error('测试页面: 校验失败 - 节点验证未通过');
      return;
    }
    validationResult.value = true;
    MessagePlugin.success('校验通过');
    console.log('测试页面: 校验通过');
  }
};

const showApiData = () => {
  if (upstreamFormRef.value) {
    apiFormattedData.value = upstreamFormRef.value.getApiFormattedData();
    MessagePlugin.info('API 数据已打印到控制台并在下方显示。');
  }
};

// 初始加载空状态
loadInitialData('empty');
</script>

<style scoped>
.t-card {
  margin-bottom: 20px;
}
</style>
