<template>
  <t-form ref="formRef" :data="localUpstreamData" label-align="top" :colon="true">
    <!-- 1. Load Balancer Algorithm -->
    <t-form-item :label="t('components.upstreamForm.loadBalancer.label')" name="type">
      <t-select
        v-model="localUpstreamData.type"
        :placeholder="t('components.upstreamForm.loadBalancer.placeholder')"
        clearable
      >
        <t-option v-for="item in LOAD_BALANCER_OPTIONS" :key="item.value" :value="item.value" :label="item.label" />
      </t-select>
    </t-form-item>

    <!-- 2. Upstream Type (Nodes or Discovery) -->
    <t-form-item :label="t('components.upstreamForm.upstreamType.label')" name="upstreamTypeSelector" required-mark>
      <t-radio-group v-model="upstreamType">
        <t-radio value="nodes">{{ t('components.upstreamForm.upstreamType.nodes') }}</t-radio>
        <t-radio value="discovery">{{ t('components.upstreamForm.upstreamType.discovery') }}</t-radio>
      </t-radio-group>
    </t-form-item>

    <!-- 2a. Nodes Configuration -->
    <div v-if="upstreamType === 'nodes'">
      <t-form-item
        v-for="(node, index) in uiNodes"
        :key="index"
        :label="index === 0 ? t('components.upstreamForm.nodes.label') : ''"
        :name="`uiNodes[${index}]`"
        class="node-item"
      >
        <div class="node-row">
          <span class="node-label">{{ t('components.upstreamForm.nodes.hostLabel') }}</span>
          <t-input
            v-model="node.host"
            class="node-input"
            :placeholder="t('components.upstreamForm.nodes.hostPlaceholder')"
            required-mark
          />
          <span class="node-label">{{ t('components.upstreamForm.nodes.portLabel') }}</span>
          <t-input-number
            v-model="node.port"
            class="node-input-number"
            :placeholder="t('components.upstreamForm.nodes.portPlaceholder')"
            :min="1"
            :max="65535"
            required-mark
            theme="normal"
          />
          <span class="node-label">{{ t('components.upstreamForm.nodes.weightLabel') }}</span>
          <t-input-number
            v-model="node.weight"
            class="node-input-number"
            :placeholder="t('components.upstreamForm.nodes.weightPlaceholder')"
            :min="0"
            required-mark
            theme="normal"
          />
          <t-button
            v-if="uiNodes.length > 1"
            shape="circle"
            variant="text"
            theme="danger"
            class="remove-button"
            @click="removeNode(index)"
          >
            <t-icon name="remove" />
          </t-button>
        </div>
      </t-form-item>
      <t-form-item>
        <t-button variant="dashed" @click="addNode">
          <template #icon><t-icon name="add" /></template>
          {{ t('components.upstreamForm.nodes.addNode') }}
        </t-button>
      </t-form-item>
    </div>

    <!-- 2b. Discovery Configuration -->
    <div v-if="upstreamType === 'discovery'">
      <t-form-item :label="t('components.upstreamForm.discovery.typeLabel')" name="discovery_type" required-mark>
        <t-select
          v-model="localUpstreamData.discovery_type"
          :placeholder="t('components.upstreamForm.discovery.typePlaceholder')"
          clearable
        >
          <t-option v-for="item in DISCOVERY_TYPE_OPTIONS" :key="item.value" :value="item.value" :label="item.label" />
        </t-select>
      </t-form-item>
      <t-form-item :label="t('components.upstreamForm.discovery.serviceNameLabel')" name="service_name" required-mark>
        <t-input
          v-model="localUpstreamData.service_name"
          :placeholder="t('components.upstreamForm.discovery.serviceNamePlaceholder')"
        />
      </t-form-item>
      <t-form-item :label="t('components.upstreamForm.discovery.hostHeaderLabel')" name="pass_host">
        <t-select
          v-model="localUpstreamData.pass_host"
          :placeholder="t('components.upstreamForm.discovery.hostHeaderPlaceholder')"
        >
          <t-option value="pass" :label="t('components.upstreamForm.discovery.hostHeaderPass')" />
          <t-option value="node" :label="t('components.upstreamForm.discovery.hostHeaderNode')" />
          <t-option value="rewrite" :label="t('components.upstreamForm.discovery.hostHeaderRewrite')" />
        </t-select>
      </t-form-item>
      <t-form-item
        v-if="localUpstreamData.pass_host === 'rewrite'"
        :label="t('components.upstreamForm.discovery.upstreamHostLabel')"
        name="upstream_host"
      >
        <t-input
          v-model="localUpstreamData.upstream_host"
          :placeholder="t('components.upstreamForm.discovery.upstreamHostPlaceholder')"
        />
      </t-form-item>
    </div>

    <!-- 3. Retries and Retry Timeout -->
    <t-row :gutter="[16, 0]">
      <t-col :span="6">
        <t-form-item :label="t('components.upstreamForm.retries.label')" name="retries">
          <t-input-number
            v-model="localUpstreamData.retries"
            :placeholder="t('components.upstreamForm.retries.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          />
        </t-form-item>
      </t-col>
      <t-col :span="6">
        <t-form-item :label="t('components.upstreamForm.retryTimeout.label')" name="retry_timeout">
          <t-input-number
            v-model="localUpstreamData.retry_timeout"
            :placeholder="t('components.upstreamForm.retryTimeout.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          >
            <template #suffix>s</template>
          </t-input-number>
        </t-form-item>
      </t-col>
    </t-row>

    <!-- 4. Protocol -->
    <t-form-item :label="t('components.upstreamForm.protocol.label')" name="scheme" required-mark>
      <t-select v-model="localUpstreamData.scheme" :placeholder="t('components.upstreamForm.protocol.placeholder')">
        <t-option v-for="item in PROTOCOL_OPTIONS" :key="item.value" :value="item.value" :label="item.label" />
      </t-select>
    </t-form-item>

    <!-- 5. Timeout Settings -->
    <t-row :gutter="[16, 0]">
      <t-col :span="4">
        <t-form-item :label="t('components.upstreamForm.connectTimeout.label')" name="timeout.connect">
          <t-input-number
            v-model="localUpstreamData.timeout.connect"
            :placeholder="t('components.upstreamForm.connectTimeout.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          >
            <template #suffix>s</template>
          </t-input-number>
        </t-form-item>
      </t-col>
      <t-col :span="4">
        <t-form-item :label="t('components.upstreamForm.sendTimeout.label')" name="timeout.send">
          <t-input-number
            v-model="localUpstreamData.timeout.send"
            :placeholder="t('components.upstreamForm.sendTimeout.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          >
            <template #suffix>s</template>
          </t-input-number>
        </t-form-item>
      </t-col>
      <t-col :span="4">
        <t-form-item :label="t('components.upstreamForm.receiveTimeout.label')" name="timeout.read">
          <t-input-number
            v-model="localUpstreamData.timeout.read"
            :placeholder="t('components.upstreamForm.receiveTimeout.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          >
            <template #suffix>s</template>
          </t-input-number>
        </t-form-item>
      </t-col>
    </t-row>

    <!-- 6. Connection Pool -->
    <t-divider>{{ t('components.upstreamForm.connectionPool.title') }}</t-divider>
    <t-row :gutter="[16, 16]">
      <t-col :span="4">
        <t-form-item :label="t('components.upstreamForm.connectionPool.capacity.label')" name="keepalive_pool.size">
          <t-input-number
            v-model="localUpstreamData.keepalive_pool.size"
            :placeholder="t('components.upstreamForm.connectionPool.capacity.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          />
        </t-form-item>
      </t-col>
      <t-col :span="4">
        <t-form-item
          :label="t('components.upstreamForm.connectionPool.idleTimeout.label')"
          name="keepalive_pool.idle_timeout"
        >
          <t-input-number
            v-model="localUpstreamData.keepalive_pool.idle_timeout"
            :placeholder="t('components.upstreamForm.connectionPool.idleTimeout.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          >
            <template #suffix>s</template>
          </t-input-number>
        </t-form-item>
      </t-col>
      <t-col :span="4">
        <t-form-item
          :label="t('components.upstreamForm.connectionPool.maxRequests.label')"
          name="keepalive_pool.requests"
        >
          <t-input-number
            v-model="localUpstreamData.keepalive_pool.requests"
            :placeholder="t('components.upstreamForm.connectionPool.maxRequests.placeholder')"
            theme="normal"
            :min="0"
            style="width: 100%"
          />
        </t-form-item>
      </t-col>
    </t-row>

    <!-- 7. Health Checks -->
    <t-divider>{{ t('components.upstreamForm.healthCheck.title') }}</t-divider>
    <t-form-item :label="t('components.upstreamForm.healthCheck.active.enableLabel')" name="healthCheckActiveEnabled">
      <t-switch v-model="isHealthCheckActive" />
    </t-form-item>

    <div v-if="isHealthCheckActive">
      <t-form-item
        :label="t('components.upstreamForm.healthCheck.active.healthCheckType')"
        name="checks.active.type"
        required-mark
      >
        <t-select v-model="localUpstreamData.checks.active.type">
          <t-option
            v-for="item in ACTIVE_HEALTH_CHECK_TYPES"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </t-select>
      </t-form-item>
      <t-form-item
        :label="t('components.upstreamForm.healthCheck.active.httpPathLabel')"
        name="checks.active.http_path"
        required-mark
      >
        <t-input
          v-model="localUpstreamData.checks.active.http_path"
          :placeholder="t('components.upstreamForm.healthCheck.active.httpPathPlaceholder')"
        />
      </t-form-item>
      <t-form-item :label="t('components.upstreamForm.healthCheck.active.hostLabel')" name="checks.active.host">
        <t-input
          v-model="localUpstreamData.checks.active.host"
          :placeholder="t('components.upstreamForm.healthCheck.active.hostPlaceholder')"
        />
      </t-form-item>
      <t-form-item :label="t('components.upstreamForm.healthCheck.active.portLabel')" name="checks.active.port">
        <t-input-number
          v-model="localUpstreamData.checks.active.port"
          :placeholder="t('components.upstreamForm.healthCheck.active.portPlaceholder')"
          theme="normal"
          :min="1"
          :max="65535"
          style="width: 100%"
        />
      </t-form-item>
      <t-row :gutter="[16, 0]">
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.timeoutLabel')"
            name="checks.active.timeout"
            required-mark
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.timeout"
              :placeholder="t('components.upstreamForm.healthCheck.active.timeoutPlaceholder')"
              theme="normal"
              :min="1"
              style="width: 100%"
            >
              <template #suffix>s</template>
            </t-input-number>
          </t-form-item>
        </t-col>
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.concurrencyLabel')"
            name="checks.active.concurrency"
            required-mark
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.concurrency"
              :placeholder="t('components.upstreamForm.healthCheck.active.concurrencyPlaceholder')"
              theme="normal"
              :min="1"
              style="width: 100%"
            />
          </t-form-item>
        </t-col>
      </t-row>

      <t-form-item
        v-if="localUpstreamData.checks.active.type === 'https'"
        :label="t('components.upstreamForm.healthCheck.active.httpsVerifyCertificateLabel')"
        name="checks.active.https_verify_certificate"
      >
        <t-switch v-model="localUpstreamData.checks.active.https_verify_certificate" />
      </t-form-item>

      <t-divider align="left">{{ t('components.upstreamForm.healthCheck.active.healthy.title') }}</t-divider>
      <t-row :gutter="[16, 0]">
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.healthy.intervalLabel')"
            name="checks.active.healthy.interval"
            required-mark
            :rules="HEALTH_CHECK_RULES['checks.active.healthy.interval']"
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.healthy.interval"
              :placeholder="t('components.upstreamForm.healthCheck.active.healthy.intervalPlaceholder')"
              theme="normal"
              :min="0"
              style="width: 100%"
            >
              <template #suffix>s</template>
            </t-input-number>
          </t-form-item>
        </t-col>
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.healthy.successesLabel')"
            name="checks.active.healthy.successes"
            required-mark
            :rules="HEALTH_CHECK_RULES['checks.active.healthy.successes']"
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.healthy.successes"
              :placeholder="t('components.upstreamForm.healthCheck.active.healthy.successesPlaceholder')"
              theme="normal"
              :min="1"
              style="width: 100%"
            />
          </t-form-item>
        </t-col>
        <t-col v-if="localUpstreamData.checks.active.type != 'tcp'" :span="12">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.healthy.httpStatusesLabel')"
            name="checks.active.healthy.http_statuses"
          >
            <number-tag-input
              v-model="localUpstreamData.checks.active.healthy.http_statuses"
              :placeholder="t('components.upstreamForm.healthCheck.active.healthy.httpStatusesPlaceholder')"
              :tag-props="{ theme: 'primary', variant: 'light' }"
              excess-tags-display="scroll"
              auto-width
            />
          </t-form-item>
        </t-col>
      </t-row>

      <t-divider align="left">{{ t('components.upstreamForm.healthCheck.active.unhealthy.title') }}</t-divider>
      <t-row :gutter="[16, 0]">
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.unhealthy.intervalLabel')"
            name="checks.active.unhealthy.interval"
            required-mark
            :rules="HEALTH_CHECK_RULES['checks.active.unhealthy.interval']"
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.unhealthy.interval"
              :placeholder="t('components.upstreamForm.healthCheck.active.unhealthy.intervalPlaceholder')"
              theme="normal"
              :min="0"
              style="width: 100%"
            >
              <template #suffix>s</template>
            </t-input-number>
          </t-form-item>
        </t-col>
        <t-col v-if="localUpstreamData.checks.active.type != 'tcp'" :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.unhealthy.httpFailuresLabel')"
            name="checks.active.unhealthy.http_failures"
            required-mark
            :rules="HEALTH_CHECK_RULES['checks.active.unhealthy.http_failures']"
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.unhealthy.http_failures"
              :placeholder="t('components.upstreamForm.healthCheck.active.unhealthy.httpFailuresPlaceholder')"
              theme="normal"
              :min="1"
              style="width: 100%"
            />
          </t-form-item>
        </t-col>
        <t-col :span="6">
          <t-form-item
            v-if="localUpstreamData.checks.active.type === 'tcp'"
            :label="t('components.upstreamForm.healthCheck.active.unhealthy.tcpFailuresLabel')"
            name="checks.active.unhealthy.tcp_failures"
          >
            <t-input-number
              v-model="localUpstreamData.checks.active.unhealthy.tcp_failures"
              :placeholder="t('components.upstreamForm.healthCheck.active.unhealthy.tcpFailuresPlaceholder')"
              theme="normal"
              :min="1"
              :max="254"
              style="width: 100%"
            />
          </t-form-item>
        </t-col>
        <t-col v-if="localUpstreamData.checks.active.type != 'tcp'" :span="12">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.unhealthy.httpStatusesLabel')"
            name="checks.active.unhealthy.http_statuses"
          >
            <number-tag-input
              v-model="localUpstreamData.checks.active.unhealthy.http_statuses"
              :placeholder="t('components.upstreamForm.healthCheck.active.unhealthy.httpStatusesPlaceholder')"
              :tag-props="{ theme: 'primary', variant: 'light' }"
              excess-tags-display="scroll"
              auto-width
            />
          </t-form-item>
        </t-col>
      </t-row>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { FormInstanceFunctions, MessagePlugin } from 'tdesign-vue-next';
import { reactive, ref, watch } from 'vue';

import NumberTagInput from '@/components/number-tag-input/index.vue';
import { t } from '@/locales';

import {
  ACTIVE_HEALTH_CHECK_TYPES,
  DISCOVERY_TYPE_OPTIONS,
  HEALTH_CHECK_RULES,
  LOAD_BALANCER_OPTIONS,
  PROTOCOL_OPTIONS,
} from './constants';

interface UiNode {
  host: string;
  port: number | null;
  weight: number;
}

// Define props for v-model
// Use Record<string, any> to accept a generic key-value object
const props = defineProps<{
  modelValue: Record<string, any> | undefined | null;
}>();

// --- Internal State ---
const formRef = ref<FormInstanceFunctions>();
const isHealthCheckActive = ref(false); // Controls visibility and data structure of health checks
const upstreamType = ref<'nodes' | 'discovery'>('nodes'); // Controls UI for nodes vs discovery

// Internal representation for UI nodes using the local UiNode interface
const uiNodes = ref<UiNode[]>([{ host: '', port: null, weight: 1 }]);

const localUpstreamData = reactive<Record<string, any>>(getDefaultUpstreamData());

// --- Helper Functions ---

// Parses APISIX nodes object {"host:port": weight} into UI array [{host, port, weight}]
// Returns the local UiNode type
function parseNodesToUi(apiNodes: Record<string, number> | undefined): UiNode[] {
  if (!apiNodes || typeof apiNodes !== 'object' || Object.keys(apiNodes).length === 0) {
    return [{ host: '', port: null, weight: 1 }]; // Return default if empty or invalid
  }
  const parsed: UiNode[] = [];
  for (const key in apiNodes) {
    if (Object.prototype.hasOwnProperty.call(apiNodes, key)) {
      const weight = apiNodes[key];
      const parts = key.split(':');
      const host = parts[0];
      const port = parts.length > 1 ? parseInt(parts[1], 10) : null;

      if (host && port !== null && !Number.isNaN(port) && typeof weight === 'number') {
        parsed.push({ host, port, weight });
      } else {
        console.warn(`[UpstreamForm] Skipping invalid node entry: ${key}:${weight}`);
        MessagePlugin.warning(t('components.upstreamForm.warnings.invalidNodeFormat'));
      }
    }
  }
  return parsed.length > 0 ? parsed : [{ host: '', port: null, weight: 1 }]; // Ensure at least one row if parsing resulted in empty
}

// Converts UI array [{host, port, weight}] back to APISIX object {"host:port": weight}
// Accepts the local UiNode type
function convertNodesToApi(nodesArray: UiNode[]): Record<string, number> | undefined {
  const apiNodes: Record<string, number> = {};
  let validNodes = 0;
  nodesArray.forEach((node) => {
    if (node.host && node.port && node.weight !== null && node.weight >= 0) {
      apiNodes[`${node.host}:${node.port}`] = node.weight;
      validNodes++;
    }
  });
  // Return undefined if no valid nodes to avoid sending empty {}
  return validNodes > 0 ? apiNodes : undefined;
}

// Gets default structure, ensuring nested objects exist for v-model bindings
// Returns a plain object structure (Record<string, any>)
function getDefaultUpstreamData(): Record<string, any> {
  return {
    type: 'roundrobin',
    nodes: undefined, // Will be populated by conversion or default
    // --- Discovery ---
    discovery_type: undefined,
    service_name: undefined,
    pass_host: 'pass',
    upstream_host: undefined,
    // --- Retries ---
    retries: undefined,
    retry_timeout: undefined,
    // --- Protocol & Timeouts ---
    scheme: 'http',
    timeout: { connect: 15, send: 15, read: 15 },
    // --- Keepalive ---
    keepalive_pool: { size: 320, idle_timeout: 60, requests: 1000 },
    // --- Health Checks (Structure needed for v-model) ---
    checks: {
      active: {
        type: 'http',
        http_path: '/',
        host: undefined,
        port: undefined,
        timeout: 1,
        concurrency: 10,
        https_verify_certificate: true,
        req_headers: [],
        healthy: {
          interval: 1,
          successes: 2,
          http_statuses: [200, 302],
        },
        unhealthy: {
          interval: 1,
          http_failures: 5,
          tcp_failures: 2,
          timeouts: 3,
          http_statuses: [429, 404, 500, 501, 502, 503, 504, 505],
        },
      },
    },
  };
}

const performReset = () => {
  Object.assign(localUpstreamData, getDefaultUpstreamData());
  uiNodes.value = parseNodesToUi(undefined);
  upstreamType.value = 'nodes';
  isHealthCheckActive.value = false;
};

// --- Watchers for Data Synchronization ---

// Watch incoming modelValue to update local state and UI nodes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === null || newVal === undefined) {
      performReset();
      return;
    }

    const incoming: Record<string, any> = newVal;
    const defaults = getDefaultUpstreamData();

    // Determine upstream type (nodes vs discovery)
    if (incoming.discovery_type) {
      upstreamType.value = 'discovery';
    } else {
      upstreamType.value = 'nodes';
    }

    // Merge top-level fields
    Object.assign(localUpstreamData, {
      ...defaults,
      ...incoming,
      // Ensure nested objects are properly merged/initialized
      timeout: { ...defaults.timeout, ...(incoming.timeout || {}) },
      keepalive_pool: { ...defaults.keepalive_pool, ...(incoming.keepalive_pool || {}) },
      // Deep merge checks, ensuring structure exists
      checks: deepMergeChecks(defaults.checks, incoming.checks),
    });

    // Convert API nodes format to UI format
    if (upstreamType.value === 'nodes') {
      uiNodes.value = parseNodesToUi(incoming.nodes as Record<string, number> | undefined);
      localUpstreamData.nodes = incoming.nodes;
    } else {
      uiNodes.value = [{ host: '', port: null, weight: 1 }];
      localUpstreamData.nodes = undefined;
    }

    isHealthCheckActive.value = !!localUpstreamData.checks?.active;

    if (isHealthCheckActive.value && !localUpstreamData.checks?.active) {
      if (!localUpstreamData.checks) {
        localUpstreamData.checks = {};
      }
      localUpstreamData.checks.active = { ...defaults.checks.active };
    } else if (isHealthCheckActive.value && localUpstreamData.checks?.active) {
      localUpstreamData.checks.active.healthy = {
        ...defaults.checks.active.healthy,
        ...(localUpstreamData.checks.active.healthy || {}),
      };
      localUpstreamData.checks.active.unhealthy = {
        ...defaults.checks.active.unhealthy,
        ...(localUpstreamData.checks.active.unhealthy || {}),
      };
    }
  },
  { immediate: true, deep: false }, // Use deep: false initially, rely on specific watchers below for deep changes
);

// Helper for deep merging checks structure (accepts/returns 'any' for flexibility)
function deepMergeChecks(defaults: any, incoming: any): any {
  if (!incoming) return defaults;
  const merged = { ...defaults };
  if (incoming.active) {
    merged.active = {
      ...(defaults.active || {}),
      ...incoming.active,
      healthy: { ...(defaults.active?.healthy || {}), ...(incoming.active.healthy || {}) },
      unhealthy: { ...(defaults.active?.unhealthy || {}), ...(incoming.active.unhealthy || {}) },
    };
  }
  // TODO(icebound): Add merging for passive checks here.
  // if (incoming.passive) { ... }
  return merged;
}

// --- UI Interaction Methods ---

const addNode = () => {
  uiNodes.value.push({ host: '', port: null, weight: 1 });
};

const removeNode = (index: number) => {
  if (uiNodes.value.length > 1) {
    uiNodes.value.splice(index, 1);
  }
};

// --- Expose Methods ---
defineExpose({
  validate: () => {
    if (upstreamType.value === 'nodes') {
      // Validate each node's host, port, and weight
      for (const node of uiNodes.value) {
        if (!node.host || !node.port || node.weight === null || node.weight < 0) {
          MessagePlugin.warning(t('components.upstreamForm.warnings.invalidNodeFormat'));
          return false;
        }
      }
    }
    return formRef.value?.validate();
  },
  getApiFormattedData: (): Record<string, any> => {
    const result: Record<string, any> = JSON.parse(JSON.stringify(localUpstreamData));

    // Apply the same cleanup logic as in emitUpdate
    if (upstreamType.value === 'nodes') {
      delete result.discovery_type;
      delete result.service_name;
      result.nodes = convertNodesToApi(uiNodes.value);
      if (!result.nodes) delete result.nodes;
    } else {
      delete result.nodes;
      if (!result.discovery_type) delete result.service_name;
    }
    if (result.pass_host !== 'rewrite') delete result.upstream_host;

    if (!isHealthCheckActive.value) {
      delete result.checks;
    } else if (result.checks?.active) {
      // Ensure type exists if active checks are enabled
      if (!result.checks.active.type) {
        result.checks.active.type = 'http';
      }
      // Optional cleanup for empty strings within active checks
      if (result.checks.active.http_path === '') delete result.checks.active.http_path;
      if (result.checks.active.host === '') delete result.checks.active.host;
    }

    // Remove undefined top-level keys
    Object.keys(result).forEach((key) => {
      if (result[key] === undefined) {
        delete result[key];
      }
    });
    console.log('Getting API Formatted Data:', result);
    return result; // Return the cleaned-up plain object
  },
  resetForm: performReset,
});
</script>

<style scoped lang="less">
.node-item {
  margin-bottom: var(--td-comp-margin-s);
  &:last-child {
    margin-bottom: 0;
  }
}

.node-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.node-label,
.remove-button {
  flex: 0 0 auto;
}

.node-input {
  flex: 1 1 200px;
  min-width: 0;
}

.node-input-number {
  flex: 0 0 80px;
  min-width: 0;
}

.node-input :deep(.t-input__inner),
.node-input-number :deep(.t-input-number__input) {
  width: 100%;
}

.remove-button {
  margin-top: 4px;
}

// Use t-row/t-col for better layout control than simple margin on unit
:deep(.t-input-number__suffix) {
  padding-left: var(--td-comp-paddingLR-s);
}

.t-divider {
  margin-top: var(--td-comp-margin-xxl);
  margin-bottom: var(--td-comp-margin-l);
  &:first-of-type {
    // No top margin for the very first divider
    margin-top: 0;
  }
}
:deep(.t-form__label--top) {
  margin-bottom: var(--td-comp-margin-s);
}
:deep(.t-form__item) {
  .t-input,
  .t-select__wrap,
  .t-input-number {
    width: 100%; // Ensure inputs fill space within cols/items
  }
}

// Align divider text left
:deep(.t-divider--horizontal.t-divider--with-text-left) {
  &::before {
    width: 2%; // Small gap before left-aligned text
  }
  &::after {
    width: 98%;
  }
}
</style>
