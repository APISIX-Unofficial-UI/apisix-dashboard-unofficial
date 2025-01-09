import apisixConsumer from './apisix-consumer';
import apisixConsumerEdit from './apisix-consumer-edit';
import apisixGlobalRule from './apisix-globalRule';
import apisixProto from './apisix-proto';
import apisixRoute from './apisix-route';
import apisixRouteEdit from './apisix-route-edit';
import apisixSecret from './apisix-secret';
import apisixSecretEdit from './apisix-secret-edit';
import apisixService from './apisix-service';
import apisixSsl from './apisix-ssl';
import apisixUpstream from './apisix-upstream';
import apisixUpstreamEdit from './apisix-upstream-edit';
import dashboardBase from './dashboard-base';
import dashboardDetail from './dashboard-detail';
import login from './login';
import result from './result';
import user from './user';

export default {
  dashboardBase,
  dashboardDetail,
  user,
  login,
  result,

  apisixRoute,
  apisixRouteEdit,
  apisixUpstream,
  apisixUpstreamEdit,
  apisixService,
  apisixConsumer,
  apisixConsumerEdit,
  apisixProto,
  apisixGlobalRule,
  apisixSsl,
  apisixSecret,
  apisixSecretEdit,
};
