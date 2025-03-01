import Ajv from 'ajv';

import { PluginApi } from '@/api/apisix/admin';
import { PluginApiApisixAdminPluginsPluginNameGetRequest } from '@/api/apisix/admin/typescript-axios';

// 根据 schema 生成默认配置，注意递归处理对象类型
export function generateDefaultFromSchema(schema: any): any {
  const defaults: Record<string, any> = {};
  if (schema.properties) {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      if (Object.prototype.hasOwnProperty.call(prop, 'default')) {
        defaults[key] = prop.default;
      } else if (prop.type === 'object') {
        defaults[key] = generateDefaultFromSchema(prop);
      }
    }
  }
  return defaults;
}

// 异步获取插件 schema
export async function fetchPluginSchema(pluginName: string): Promise<any> {
  const req: PluginApiApisixAdminPluginsPluginNameGetRequest = { pluginName };
  const res = await PluginApi.apisixAdminPluginsPluginNameGet(req);
  return res.data;
}

// 使用 Ajv 校验配置是否符合 schema，返回验证结果和错误信息
export async function validateConfigWithSchema(config: any, schema: any): Promise<{ valid: boolean; errors?: any }> {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = await validate(config);
  return { valid, errors: validate.errors };
}
