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
      <!-- Currently only supporting active checks based on example -->
      <t-form-item
        :label="t('components.upstreamForm.healthCheck.active.httpPathLabel')"
        name="checks.active.http_path"
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

      <t-divider align="left">{{ t('components.upstreamForm.healthCheck.active.healthy.title') }}</t-divider>
      <t-row :gutter="[16, 0]">
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.healthy.intervalLabel')"
            name="checks.active.healthy.interval"
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
      </t-row>

      <t-divider align="left">{{ t('components.upstreamForm.healthCheck.active.unhealthy.title') }}</t-divider>
      <t-row :gutter="[16, 0]">
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.unhealthy.intervalLabel')"
            name="checks.active.unhealthy.interval"
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
        <t-col :span="6">
          <t-form-item
            :label="t('components.upstreamForm.healthCheck.active.unhealthy.httpFailuresLabel')"
            name="checks.active.unhealthy.http_failures"
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
      </t-row>
      <!-- Add fields for other check types (tcp, https) or passive checks if needed -->
    </div>
  </t-form>
</template>

<script setup lang="ts">
import debounce from 'lodash/debounce';
import { FormInstanceFunctions, MessagePlugin } from 'tdesign-vue-next';
import { reactive, ref, watch } from 'vue';

// Removed the problematic import:
// import { Node, Upstream } from '@/api/apisix/typing';
import { t } from '@/locales'; // Assuming your i18n setup

import { DISCOVERY_TYPE_OPTIONS, LOAD_BALANCER_OPTIONS, PROTOCOL_OPTIONS } from './constants';

// Define a simple interface for the UI representation of a node
// This replaces the imported 'Node' type for internal use.
interface UiNode {
  host: string;
  port: number | null;
  weight: number;
}

// Define props and emit for v-model
// Use Record<string, any> to accept a generic key-value object
const props = defineProps<{
  modelValue: Record<string, any> | undefined | null; // Accept plain object
}>();

// Emit uses a plain object structure
const emit = defineEmits(['update:modelValue']);

// --- Internal State ---
const formRef = ref<FormInstanceFunctions>();
const isHealthCheckActive = ref(false); // Controls visibility and data structure of health checks
const upstreamType = ref<'nodes' | 'discovery'>('nodes'); // Controls UI for nodes vs discovery

// Internal representation for UI nodes using the local UiNode interface
const uiNodes = ref<UiNode[]>([{ host: '', port: null, weight: 1 }]);

// Local reactive state holding the data structure closer to APISIX schema
// Note: localUpstreamData.nodes will store the {"host:port": weight} format
// Use Record<string, any> for the internal state as well
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
        MessagePlugin.warning(t('components.upstreamForm.warnings.invalidNodeFormat', { entry: `${key}:${weight}` }));
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
        type: 'http', // Default type if enabling active checks
        http_path: undefined,
        host: undefined, // SNI Host
        healthy: {
          interval: undefined,
          successes: undefined,
        },
        unhealthy: {
          interval: undefined,
          http_failures: undefined, // Use http_failures for http checks
        },
        // Add other potential fields like `port`, `https_verify_certificate`, `req_headers` if needed
      },
      // passive: { ... } // Add passive structure if needed later
    },
  };
}

// --- Watchers for Data Synchronization ---

// Watch incoming modelValue to update local state and UI nodes
watch(
  () => props.modelValue,
  (newVal) => {
    const defaults = getDefaultUpstreamData();
    // Ensure incoming value is treated as a plain object
    const incoming: Record<string, any> = newVal || {};

    // Determine upstream type (nodes vs discovery)
    // if (incoming.discovery_type) {
    //   upstreamType.value = 'discovery';
    // } else {
    //   upstreamType.value = 'nodes';
    // }

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
      // Cast incoming.nodes to the expected format for parseNodesToUi
      uiNodes.value = parseNodesToUi(incoming.nodes as Record<string, number> | undefined);
      localUpstreamData.nodes = incoming.nodes; // Keep API format in local data for now
    } else {
      uiNodes.value = [{ host: '', port: null, weight: 1 }]; // Reset UI nodes if discovery
      // localUpstreamData.nodes = undefined; // Clear API nodes if discovery
    }

    // Set health check switch state
    // Use optional chaining for safety as checks might not exist
    isHealthCheckActive.value = !!localUpstreamData.checks?.active; // Enable switch if active checks exist

    // Ensure checks.active structure exists if switch is on but data was missing details
    if (isHealthCheckActive.value && !localUpstreamData.checks?.active) {
      // Ensure checks object exists before assigning to active
      if (!localUpstreamData.checks) {
        localUpstreamData.checks = {};
      }
      localUpstreamData.checks.active = { ...defaults.checks.active };
    } else if (isHealthCheckActive.value && localUpstreamData.checks?.active) {
      // Ensure nested healthy/unhealthy objects exist if active is present
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
  // Add merging for passive checks here if implemented
  // if (incoming.passive) { ... }
  return merged;
}

// Debounced function to emit updates when local data changes
const emitUpdate = debounce(() => {
  // Clone the local data to create the object to emit
  const dataToEmit: Record<string, any> = JSON.parse(JSON.stringify(localUpstreamData)); // Deep clone

  // Clean up based on upstreamType
  if (upstreamType.value === 'nodes') {
    delete dataToEmit.discovery_type;
    delete dataToEmit.service_name;
    // Convert UI nodes back to API format just before emitting
    dataToEmit.nodes = convertNodesToApi(uiNodes.value);
    if (!dataToEmit.nodes) delete dataToEmit.nodes; // Remove nodes if empty/invalid
  } else {
    // discovery
    delete dataToEmit.nodes;
    if (!dataToEmit.discovery_type) delete dataToEmit.service_name;
  }

  // Clean up host header fields
  if (dataToEmit.pass_host !== 'rewrite') {
    delete dataToEmit.upstream_host;
  }

  // Clean up health checks based on the switch
  if (!isHealthCheckActive.value) {
    delete dataToEmit.checks; // Remove entire checks object if switch is off
  } else {
    // Optional: Further cleanup within active checks if needed (e.g., remove empty strings)
    if (dataToEmit.checks?.active?.http_path === '') delete dataToEmit.checks.active.http_path;
    if (dataToEmit.checks?.active?.host === '') delete dataToEmit.checks.active.host;
    // ... potentially more cleanup ...

    // Ensure the 'type' field exists if active checks are enabled and it's missing
    if (dataToEmit.checks?.active && !dataToEmit.checks.active.type) {
      dataToEmit.checks.active.type = 'http'; // Set default type
    }
  }

  // Remove undefined top-level keys (optional, depends on API expectations)
  Object.keys(dataToEmit).forEach((key) => {
    // Check specifically for undefined, allow null or other falsy values if intended
    if (dataToEmit[key] === undefined) {
      delete dataToEmit[key];
    }
  });

  console.log('Emitting:', dataToEmit);
  // Emit the cleaned-up plain object
  emit('update:modelValue', dataToEmit);
}, 300); // Debounce emission by 300ms

// Watch deep changes in localUpstreamData (excluding nodes, handled separately)
watch(
  () => {
    const { nodes, ...rest } = localUpstreamData;
    return rest;
  },
  emitUpdate,
  { deep: true },
);

// Watch for changes in the UI nodes array and update API format
watch(
  uiNodes,
  (newNodes) => {
    // Update nodes in localUpstreamData without triggering the localUpstreamData watcher
    const apiNodes = convertNodesToApi(newNodes);
    if (JSON.stringify(localUpstreamData.nodes) !== JSON.stringify(apiNodes)) {
      localUpstreamData.nodes = apiNodes;
      emitUpdate();
    }
  },
  { deep: true },
);

// Watch the health check switch
watch(isHealthCheckActive, (isActive) => {
  if (isActive) {
    // If activating, ensure the checks.active structure exists
    const defaults = getDefaultUpstreamData(); // Get defaults again
    if (!localUpstreamData.checks) {
      localUpstreamData.checks = { active: { ...defaults.checks.active } };
    } else if (!localUpstreamData.checks.active) {
      localUpstreamData.checks.active = { ...defaults.checks.active };
    }
    // Ensure nested structures exist using defaults as fallback
    if (!localUpstreamData.checks.active.healthy) {
      localUpstreamData.checks.active.healthy = { ...defaults.checks.active.healthy };
    }
    if (!localUpstreamData.checks.active.unhealthy) {
      localUpstreamData.checks.active.unhealthy = { ...defaults.checks.active.unhealthy };
    }
  }
  // Trigger emission when switch changes
  emitUpdate();
});

// Watch the UI upstream type selector
watch(upstreamType, (newType) => {
  if (newType === 'nodes') {
    localUpstreamData.discovery_type = undefined;
    localUpstreamData.service_name = undefined;
    // Convert existing API nodes back to UI format if they exist, else default
    const currentUiNodes = parseNodesToUi(localUpstreamData.nodes as Record<string, number> | undefined);
    if (JSON.stringify(uiNodes.value) !== JSON.stringify(currentUiNodes)) {
      uiNodes.value = currentUiNodes;
    }
  } else {
    // discovery
    localUpstreamData.nodes = undefined; // Clear API nodes
    uiNodes.value = [{ host: '', port: null, weight: 1 }]; // Reset UI nodes
  }
  emitUpdate(); // Trigger update when type changes
});

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
    return formRef.value?.validate();
  },
  // Expose the *final* data structure intended for the API as a plain object
  getApiFormattedData: (): Record<string, any> => {
    // Manually trigger the final conversion and cleanup logic used in emitUpdate
    // Clone the data first
    const dataToEmit: Record<string, any> = JSON.parse(JSON.stringify(localUpstreamData));

    // Apply the same cleanup logic as in emitUpdate
    if (upstreamType.value === 'nodes') {
      delete dataToEmit.discovery_type;
      delete dataToEmit.service_name;
      dataToEmit.nodes = convertNodesToApi(uiNodes.value);
      if (!dataToEmit.nodes) delete dataToEmit.nodes;
    } else {
      delete dataToEmit.nodes;
      if (!dataToEmit.discovery_type) delete dataToEmit.service_name;
    }
    if (dataToEmit.pass_host !== 'rewrite') delete dataToEmit.upstream_host;

    if (!isHealthCheckActive.value) {
      delete dataToEmit.checks;
    } else if (dataToEmit.checks?.active) {
      // Ensure type exists if active checks are enabled
      if (!dataToEmit.checks.active.type) {
        dataToEmit.checks.active.type = 'http';
      }
      // Optional cleanup for empty strings within active checks
      if (dataToEmit.checks.active.http_path === '') delete dataToEmit.checks.active.http_path;
      if (dataToEmit.checks.active.host === '') delete dataToEmit.checks.active.host;
    }

    // Remove undefined top-level keys
    Object.keys(dataToEmit).forEach((key) => {
      if (dataToEmit[key] === undefined) {
        delete dataToEmit[key];
      }
    });
    console.log('Getting API Formatted Data:', dataToEmit);
    return dataToEmit; // Return the cleaned-up plain object
  },
});
</script>

<style scoped lang="less">
.node-item {
  margin-bottom: var(--td-comp-margin-s);
  // Ensure nested form items don't inherit excessive bottom padding
  &:last-child {
    margin-bottom: 0; // Remove margin for the last node row before the add button
  }
}

.node-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.node-label {
  flex-shrink: 0;
  width: auto;
  padding: 0 4px;
  text-align: right;
  color: var(--td-text-color-secondary);
}

.node-input {
  flex-grow: 1;
  min-width: 150px;
}

.node-input-number {
  width: 100px;
  flex-shrink: 0;
}

.remove-button {
  margin-left: 8px;
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
