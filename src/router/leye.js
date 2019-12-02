export default [{
  path: 'leye',
  name: 'main-leye',
  component: () => import('../views/leye/index.vue'),
  meta: {
    title: '乐业卡'
  }
},
{
  path: 'editInfo',
  name: 'main-leye-editInfo',
  component: () => import('../views/leye/editInfo.vue'),
  meta: {
    title: '编辑公司信息'
  }
},
{
  path: 'uploadStaff',
  name: 'main-leye-uploadStaff',
  component: () => import('../views/leye/uploadStaff.vue'),
  meta: {
    title: '上传员工列表'
  }
},
{
  path: 'craeteSuccess',
  name: 'main-leye-craeteSuccess',
  component: () => import('../views/leye/craeteSuccess.vue'),
  meta: {
    title: '创建成功'
  }
},
{
  path: 'uploadList',
  name: 'main-leye-uploadList',
  component: () => import('../views/leye/uploadList.vue'),
  meta: {
    title: '上传员工信息列表'
  }
},
{
  path: 'editInfo',
  name: 'main-leye-editInfo',
  component: () => import('../views/leye/editInfo.vue'),
  meta: {
    title: '编辑公司信息'
  }
},
{
  path: 'uploadStaff',
  name: 'main-leye-uploadStaff',
  component: () => import('../views/leye/uploadStaff.vue'),
  meta: {
    title: '上传员工列表'
  }
},
{
  path: 'myWork',
  name: 'main-leye-myWork',
  component: () => import('../views/leye/myWork.vue'),
  meta: {
    title: '我的工作台'
  }
},
{
  path: 'staffManage',
  name: 'main-leye-staffManage',
  component: () => import('../views/leye/staffManage.vue'),
  meta: {
    title: '员工管理'
  }
},
{
  path: 'pointsQuery',
  name: 'main-leye-pointsQuery',
  component: () => import('../views/leye/pointsQuery.vue'),
  meta: {
    title: '积分发放查询'
  }
},
{
  path: 'recharge',
  name: 'main-leye-recharge',
  component: () => import('../views/leye/recharge.vue'),
  meta: {
    title: '对账明细'
  }
},
{
  path: 'integralRecharge',
  name: 'main-leye-integralRecharge',
  component: () => import('../views/leye/integralRecharge.vue'),
  meta: {
    title: '积分充值'
  }
},
{
  path: 'integralGrant',
  name: 'main-leye-integralGrant',
  component: () => import('../views/leye/integralGrant.vue'),
  meta: {
    title: '积分发放'
  }
},
{
  path: 'empty',
  name: 'main-leye-empty',
  component: () => import('../views/leye/empty.vue'),
  meta: {
    title: '积分发放'
  }
},
{
  path: 'rechargePay',
  name: 'main-leye-rechargePay',
  component: () => import('../views/leye/rechargePay.vue'),
  meta: {
    title: '充值支付'
  }
},
{
  path: 'weixinSaoma',
  name: 'main-leye-weixinSaoma',
  component: () => import('../views/leye/weixinSaoma.vue'),
  meta: {
    title: '微信扫码'
  }
},
{
  path: 'palyResult',
  name: 'main-leye-palyResult',
  component: () => import('../views/leye/palyResult.vue'),
  meta: {
    title: '支付结果'
  }
}
]
