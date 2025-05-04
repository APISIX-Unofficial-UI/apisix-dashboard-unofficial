import apisixUpstreamForm from './apisix-upstream-form';
import components from './components';
import configEditor from './plugin/config-editor';
import configList from './plugin/config-list';
import schemaInfo from './plugin/schema-info';
import upstreamForm from './upstream/upstream-form';

export default {
  components,
  apisixUpstreamForm,
  plugin: {
    configList,
    configEditor,
    schemaInfo,
  },
  upstreamForm,
};
