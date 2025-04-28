import { t } from '@/locales';

export const LOAD_BALANCER_OPTIONS = [
  { label: t('components.upstreamForm.loadBalancer.roundRobin'), value: 'roundrobin' },
  { label: t('components.upstreamForm.loadBalancer.consistentHash'), value: 'chash' },
  { label: t('components.upstreamForm.loadBalancer.ewma'), value: 'ewma' },
  { label: t('components.upstreamForm.loadBalancer.leastConn'), value: 'least_conn' },
];

export const DISCOVERY_TYPE_OPTIONS = [
  { label: 'DNS', value: 'dns' },
  { label: 'Consul', value: 'consul' },
  { label: 'Consul KV', value: 'consul_kv' },
  { label: 'Kubernetes', value: 'kubernetes' },
  { label: 'Nacos', value: 'nacos' },
  { label: 'Eureka', value: 'eureka' },
];

export const PROTOCOL_OPTIONS = [
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' },
  { label: 'gRPC', value: 'grpc' },
  { label: 'gRPCS', value: 'grpcs' },
];

interface ValidationRule {
  required: boolean;
  message: string;
}

export const HEALTH_CHECK_RULES: Record<string, ValidationRule[]> = {
  'checks.active.http_path': [
    { required: true, message: t('components.upstreamForm.healthCheck.active.httpPathRequired') },
  ],
  'checks.active.host': [{ required: true, message: t('components.upstreamForm.healthCheck.active.hostRequired') }],
  'checks.active.healthy.interval': [
    { required: true, message: t('components.upstreamForm.healthCheck.active.healthy.intervalRequired') },
  ],
  'checks.active.healthy.successes': [
    { required: true, message: t('components.upstreamForm.healthCheck.active.healthy.successesRequired') },
  ],
  'checks.active.unhealthy.interval': [
    { required: true, message: t('components.upstreamForm.healthCheck.active.unhealthy.intervalRequired') },
  ],
  'checks.active.unhealthy.http_failures': [
    { required: true, message: t('components.upstreamForm.healthCheck.active.unhealthy.httpFailuresRequired') },
  ],
};
