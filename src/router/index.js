/**
 * 路由通用类
 * author by kairry 2017年11月20日
 */
const Index = resolve => require(['@/views/index/Index'], resolve)

const Auth = resolve => require(['@/views/auth/Auth'], resolve)
const Init = resolve => require(['@/views/init/Init'], resolve)
const TimingList = resolve => require(['@/views/timing/List'], resolve)
const TimingEdet = resolve => require(['@/views/timing/Edit'], resolve)
const Set = resolve => require(['@/views/set/Index'], resolve)
const WenkongSet = resolve => require(['@/views/wenongSet/Index'], resolve)
const DevInfo = resolve => require(['@/views/set/DevInfo'], resolve)
const Share = resolve => require(['@/views/set/Share'], resolve)
const WKShare = resolve => require(['@/views/wenongSet/Share'], resolve)
const Data = resolve => require(['@/views/set/Data'], resolve)
const Battery = resolve => require(['@/views/set/Battery'], resolve)
const Config = resolve => require(['@/views/set/Config'], resolve)
const WKConfig = resolve => require(['@/views/wenongSet/Config'], resolve)
const List = resolve => require(['@/views/list/Index'], resolve)
const Demo = resolve => require(['@/views/demo'], resolve)
const Permissions = resolve => require(['@/views/set/Permissions'], resolve)
const Group = resolve => require(['@/views/set/Group'], resolve)
const WenKongIndex = resolve => require(['@/views/wenkong/Index'], resolve)
const AirPurifier = resolve => require(['@/views/air-purifier'], resolve)
const KaiChe = resolve => require(['@/views/kaiche'], resolve)

let routes = [
  {
    path: '*',
    redirect: '/init'
  },
  {
    path: '/auth',
    component: Auth,
    meta: {
      title: ''
    }
  },
  {
    path: '/demo',
    component: Demo,
    meta: {
      title: ''
    }
  },
  {
    path: '/init',
    component: Init,
    meta: {
      title: ''
    }
  },
  {
    path: '/permissions',
    component: Permissions,
    meta: {
      title: ''
    }
  },
  {
    path: '/group',
    component: Group,
    meta: {
      title: ''
    }
  },
  {
    path: '/index',
    component: Index,
    meta: {
      title: ''
    }
  },
  {
    path: '/timinglist',
    component: TimingList,
    meta: {
      title: ''
    }
  },
  {
    path: '/timingedet',
    component: TimingEdet,
    meta: {
      title: ''
    }
  },
  {
    path: '/set',
    component: Set,
    meta: {
      title: ''
    }
  },
  {
    path: '/wenkongset',
    component: WenkongSet,
    meta: {
      title: ''
    }
  },
  {
    path: '/devinfo',
    component: DevInfo,
    meta: {
      title: ''
    }
  },
  {
    path: '/share',
    component: Share,
    meta: {
      title: ''
    }
  },
  {
    path: '/wkshare',
    component: WKShare,
    meta: {
      title: ''
    }
  },
  {
    path: '/data',
    component: Data,
    meta: {
      title: ''
    }
  },
  {
    path: '/battery',
    component: Battery,
    meta: {
      title: ''
    }
  },
  {
    path: '/config',
    component: Config,
    meta: {
      title: ''
    }
  },
  {
    path: '/wkconfig',
    component: WKConfig,
    meta: {
      title: ''
    }
  },
  {
    path: '/list',
    component: List,
    meta: {
      title: '设备列表'
    }
  },
  {
    path: '/air-purifier',
    component: AirPurifier,
    meta: {
      title: ''
    }
  },
  {
    path: '/wenkongindex',
    component: WenKongIndex,
    meta: {
      title: ''
    }
  },
  {
    path: '/kaiche',
    component: KaiChe
  }
]

export default routes
