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
          <t-button theme="primary" @click="validateForm">校验表单</t-button>
          <t-button theme="success" @click="showApiData">显示 API 格式数据</t-button>
        </t-space>
        <t-alert v-if="validationResult !== null" :theme="validationResult ? 'success' : 'error'">
          校验结果: {{ validationResult ? '通过' : '失败' }}
        </t-alert>
      </t-space>
    </t-card>

    <t-card title="当前表单数据 (v-model 绑定)" style="margin-top: 20px">
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
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
      /* ... 节点示例数据 ... */
    };
  } else if (type === 'discovery') {
    formData.value = {
      /* ... 服务发现示例数据 ... */
    };
  } else {
    formData.value = null;
  }
  console.log('测试页面: 加载数据', formData.value);
};

const validateForm = async () => {
  if (upstreamFormRef.value) {
    const result = upstreamFormRef.value.validate();
    // result 可能是 false（节点验证失败）或 Promise（表单验证）
    if (result === false) {
      validationResult.value = false;
      MessagePlugin.error('校验失败');
      console.error('测试页面: 校验失败 - 节点验证未通过');
      return;
    }

    try {
      await result;
      validationResult.value = true;
      MessagePlugin.success('校验通过');
      console.log('测试页面: 校验通过');
    } catch (error) {
      validationResult.value = false;
      MessagePlugin.error('校验失败');
      console.error('测试页面: 校验失败', error);
    }
  }
};

const showApiData = () => {
  if (upstreamFormRef.value) {
    // 假设 UpstreamForm 暴露了 getApiFormattedData 方法
    apiFormattedData.value = upstreamFormRef.value.getApiFormattedData();
    console.log('测试页面: 获取 API 格式化数据', apiFormattedData.value);
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
