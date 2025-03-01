/* eslint-disable no-underscore-dangle */
import Ajv, { Options } from 'ajv';

import { PluginApi } from '@/api/apisix/admin';
import { PluginApiApisixAdminPluginsPluginNameGetRequest } from '@/api/apisix/admin/typescript-axios';

function getZeroValue(type: string): any {
  switch (type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    default:
      return null;
  }
}

// 根据 schema 生成默认配置，注意递归处理对象类型
export function generateDefaultFromSchema(schema: any): any {
  const defaults: Record<string, any> = {};
  if (schema.properties) {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      // 如果有默认值则直接赋值
      if (Object.prototype.hasOwnProperty.call(prop, 'default')) {
        defaults[key] = prop.default;
      }
      // 对象类型递归生成默认配置
      else if (prop.type === 'object') {
        defaults[key] = generateDefaultFromSchema(prop);
      }
      // 如果是必填项且没有默认值，赋零值
      else if (schema.required && schema.required.includes(key)) {
        defaults[key] = getZeroValue(prop.type);
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
  const ajvOptions: Options = {
    useDefaults: true, // 或者 "empty"
  };
  const ajv = new Ajv(ajvOptions);
  const validate = ajv.compile(schema);
  const valid = await validate(config);
  return { valid, errors: validate.errors };
}
