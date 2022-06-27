/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import ClusterDriver from 'shared/mixins/cluster-driver';
// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed     = Ember.computed;
const observer     = Ember.observer;
const get          = Ember.get;
const set          = Ember.set;
const setProperties= Ember.setProperties;
const service      = Ember.inject.service;
const all          = Ember.RSVP.all;
const reject       = Ember.RSVP.reject;
const resolve       = Ember.RSVP.resolve
const next         = Ember.run.next;
const equal        = Ember.computed.equal;
/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const ENDPOINT = 'tencentcloudapi.com/';
const CCS_ENDPOINT = 'api.qcloud.com/v2/index.php';

const DATA_DISK = 'DATA_DISK'
const SYSTEM_DISK = 'SYSTEM_DISK'

const BAND_WIDTH = [
  {
    label: 'clusterNew.tencenttke.bandwidthType.hour',
    value: 'PayByHour'
  },
  {
    label: 'clusterNew.tencenttke.bandwidthType.traffic',
    value: 'PayByTraffic'
  }
];

const languages = {
  'en-us':   {"clusterNew":{"tencenttke":{"label":"Tencent Kubernetes Engine","shortLabel":"Tencent TKE","access":{"next":"Next: Configure Cluster","loading":"Loading VPCs from Tencent Cloud","title":"Account Access","detail":"Choose the region and API Key that will be used to launch Tencent Kubernetes Service"},"cluster":{"title":"Cluster Configuration","detail":"Choose the VPC and Kubernetes version that will be used to launch Tencent Kubernetes Service","next":"Next: Select Instance Type","loading":"Loading Availability Zones from Tencent Cloud","name":{"required":"Cluster name is required"}},"node":{"title":"Instance Type","detail":"Choose the instance type that will be used to launch Tencent Kubernetes Service","next":"Next: Configure Instance","loading":"Loading configuration from Tencent Cloud"},"instance":{"title":"Instance Configuration","detail":"Configure the instance that will be used to launch Tencent Kubernetes Service"},"subnet":{"label":"Subnet","required":"Subnet is required"},"os":{"label":"Operating System"},"disk":{"LOCAL_BASIC":"Local Basic","LOCAL_SSD":"Local SSD","CLOUD_BASIC":"Cloud Basic","CLOUD_PREMIUM":"Cloud Premium","CLOUD_SSD":"Cloud SSD"},"rootSize":{"label":"Root Disk Size","placeholder":"e.g. 25"},"rootType":{"label":"Root Disk Type"},"storageType":{"label":"Data Disk Type"},"storageSize":{"label":"Data Disk Size","placeholder":"e.g. 10"},"bandwidth":{"label":"Band Width","placeholder":"e.g. 10"},"nodeCount":{"label":"Node Count","placeholder":"e.g. 3","required":"Node Count is required","help":"The count of nodes will be launched in this Kubernetes cluster"},"bandwidthType":{"label":"Band Width Type","hour":"Pay By Hour","traffic":"Pay By Traffic"},"keyPair":{"label":"Key Pair","required":"Key Pair is required"},"region":{"label":"Region"},"secretId":{"label":"Secret ID","placeholder":"Your Tencent Cloud secret id","required":"Secret ID is required"},"secretKey":{"label":"Secret Key","placeholder":"Your Tencent Cloud secret key","provided":"Provided","required":"Secret Key is required"},"securityGroup":{"label":"Security Group","required":"Security Group is required"},"vpc":{"label":"VPC","required":"VPC is required"},"version":{"label":"Kubernetes Version","warning":"“{version}”，This version is not supported by Rancher, please upgrade Rancher version for reference","warningTip":"Rancher supported versions."},"cidr":{"label":"Container Network CIDR","placeholder":"e.g. 172.16.0.0/16","required":"Container Network CIDR is required"},"zone":{"label":"Availability Zone","required":"Availability Zone is required"},"instanceType":{"label":"Instance Type","required":"Instance Type is required"},"regions":{"ap-guangzhou":"Guangzhou","ap-shanghai":"Shanghai","ap-beijing":"Beijing","ap-chengdu":"Chengdu","ap-chongqing":"Chongqing","ap-nanjing":"Nanjing","ap-hongkong":"Hong Kong","ap-singapore":"Singapore","na-toronto":"Toronto","ap-bangkok":"Bangkok","ap-mumbai":"Mumbai","ap-seoul":"Seoul","ap-tokyo":"Tokyo","na-siliconvalley":"Silicon Valley","na-ashburn":"Virginia","eu-frankfurt":"Frankfurt","eu-moscow":"Moscow","ap-jakarta":"Jakarta","sa-saopaulo":"Saopaulo"}}}},
  'zh-hans': {"clusterNew":{"tencenttke":{"label":"腾讯云Kubernetes服务","shortLabel":"Tencent TKE","access":{"next":"下一步: 配置集群","loading":"从腾讯云获取VPC信息","title":"账户认证","detail":"选择腾讯云Kubernetes服务所使用的区域"},"cluster":{"title":"集群配置","detail":"选择腾讯云Kubernetes服务中使用的VPC和版本","next":"下一步: 选择主机类型","loading":"从腾讯云获取可用区信息","name":{"required":"请输入集群名称"}},"node":{"title":"主机类型","detail":"选择腾讯云Kubernetes服务中使用的主机类型","next":"下一步: 配置节点","loading":"从腾讯云获取节点配置信息"},"instance":{"title":"节点配置","detail":"配置腾讯云Kubernetes服务中的节点"},"subnet":{"label":"子网","required":"请选择子网"},"os":{"label":"操作系统"},"disk":{"LOCAL_BASIC":"Local Basic","LOCAL_SSD":"Local SSD","CLOUD_BASIC":"Cloud Basic","CLOUD_PREMIUM":"Cloud Premium","CLOUD_SSD":"Cloud SSD"},"rootSize":{"label":"系统盘大小","placeholder":"例如: 25"},"rootType":{"label":"系统盘类型"},"storageType":{"label":"数据盘类型"},"storageSize":{"label":"数据盘大小","placeholder":"例如: 10"},"bandwidth":{"label":"带宽","placeholder":"例如: 10"},"nodeCount":{"label":"节点数量","placeholder":"例如: 3","required":"请输入节点数量","help":"将要创建的腾讯云Kubernetes服务中所含有的节点数量"},"bandwidthType":{"label":"带宽类型","hour":"按带宽使用时长计费","traffic":"按流量计费"},"keyPair":{"label":"密钥","required":"请选择密钥"},"region":{"label":"区域"},"secretId":{"label":"密钥ID","placeholder":"您的腾讯云API密钥ID","required":"请输入密钥ID"},"secretKey":{"label":"密钥","placeholder":"您的腾讯云API密钥","provided":"已提供","required":"请输入密钥"},"securityGroup":{"label":"安全组","required":"请选择安全组"},"vpc":{"label":"VPC","required":"请选择VPC"},"version":{"label":"Kubernetes版本","warning":"“{version}”，此版本不在 Rancher 支持矩阵范围内，请升级 Rancher 版本。可参考","warningTip":"Rancher 支持矩阵。"},"cidr":{"label":"容器网络 CIDR","placeholder":"例如: 172.16.0.0/16","required":"请输入容器网络的CIDR"},"zone":{"label":"可用区","required":"请选择可用区"},"instanceType":{"label":"实例类型","required":"请选择实例类型"},"regions":{"ap-guangzhou":"广州","ap-shanghai":"上海","ap-beijing":"北京","ap-chengdu":"成都","ap-chongqing":"重庆","ap-nanjing":"南京","ap-hongkong":"香港","ap-singapore":"新加坡","na-toronto":"多伦多","ap-bangkok":"曼谷","ap-mumbai":"孟买","ap-seoul":"首尔","ap-tokyo":"东京","na-siliconvalley":"硅谷","na-ashburn":"弗吉尼亚","eu-frankfurt":"法兰克福","eu-moscow":"莫斯科","ap-jakarta":"雅加达","sa-saopaulo":"圣保罗"}}}},
  'zh-hant': {"clusterNew":{"tencenttke":{"label":"騰訊雲Kubernetes服務","shortLabel":"Tencent TKE","access":{"next":"下一步: 配置集羣","loading":"從騰訊雲獲取VPC信息","title":"賬戶認證","detail":"選擇騰訊雲Kubernetes服務所使用的區域"},"cluster":{"title":"集羣配置","detail":"選擇騰訊雲Kubernetes服務中使用的VPC和版本","next":"下一步: 選擇主機類型","loading":"從騰訊雲獲取可用區信息","name":{"required":"請輸入集羣名稱"}},"node":{"title":"主機類型","detail":"選擇騰訊雲Kubernetes服務中使用的主機類型","next":"下一步: 配置節點","loading":"從騰訊雲獲取節點配置信息"},"instance":{"title":"節點配置","detail":"配置騰訊雲Kubernetes服務中的節點"},"subnet":{"label":"子網","required":"請選擇子網"},"os":{"label":"操作系統"},"disk":{"LOCAL_BASIC":"Local Basic","LOCAL_SSD":"Local SSD","CLOUD_BASIC":"Cloud Basic","CLOUD_PREMIUM":"Cloud Premium","CLOUD_SSD":"Cloud SSD"},"rootSize":{"label":"系統盤大小","placeholder":"例如: 25"},"rootType":{"label":"系統盤類型"},"storageType":{"label":"數據盤類型"},"storageSize":{"label":"數據盤大小","placeholder":"例如: 10"},"bandwidth":{"label":"帶寬","placeholder":"例如: 10"},"nodeCount":{"label":"節點數量","placeholder":"例如: 3","required":"請輸入節點數量","help":"將要創建的騰訊雲Kubernetes服務中所含有的節點數量"},"bandwidthType":{"label":"帶寬類型","hour":"按帶寬使用時長計費","traffic":"按流量計費"},"keyPair":{"label":"密鑰","required":"請選擇密鑰"},"region":{"label":"區域"},"secretId":{"label":"密鑰ID","placeholder":"您的騰訊雲API密鑰ID","required":"請輸入密鑰ID"},"secretKey":{"label":"密鑰","placeholder":"您的騰訊雲API密鑰","provided":"已提供","required":"請輸入密鑰"},"securityGroup":{"label":"安全組","required":"請選擇安全組"},"vpc":{"label":"VPC","required":"請選擇VPC"},"version":{"label":"Kubernetes版本","warning":"“{version}”，此版本不在 Rancher 支持矩陣範圍內，請升級 Rancher 版本。可參考","warningTip":"Rancher 支持矩陣。"},"cidr":{"label":"容器網絡 CIDR","placeholder":"例如: 172.16.0.0/16","required":"請輸入容器網絡的CIDR"},"zone":{"label":"可用區","required":"請選擇可用區"},"instanceType":{"label":"實例類型","required":"請選擇實例類型"},"regions":{"ap-guangzhou":"廣州","ap-shanghai":"上海","ap-beijing":"北京","ap-chengdu":"成都","ap-chongqing":"重慶","ap-nanjing":"南京","ap-hongkong":"香港","ap-singapore":"新加坡","na-toronto":"多倫多","ap-bangkok":"曼谷","ap-mumbai":"孟買","ap-seoul":"首爾","ap-tokyo":"東京","na-siliconvalley":"硅谷","na-ashburn":"弗吉尼亞","eu-frankfurt":"法蘭克福","eu-moscow":"莫斯科","ap-jakarta":"雅加達","sa-saopaulo":"聖保羅"}}}},
  'zh-hant-tw': {"clusterNew":{"tencenttke":{"label":"騰訊雲Kubernetes服務","shortLabel":"Tencent TKE","access":{"next":"下一步: 配置叢集","loading":"從騰訊雲獲取VPC信息","title":"賬戶認證","detail":"選擇騰訊雲Kubernetes服務所使用的區域"},"cluster":{"title":"叢集配置","detail":"選擇騰訊雲Kubernetes服務中使用的VPC和版本","next":"下一步: 選擇主機類型","loading":"從騰訊雲獲取可用區信息","name":{"required":"請輸入叢集名稱"}},"node":{"title":"主機類型","detail":"選擇騰訊雲Kubernetes服務中使用的主機類型","next":"下一步: 配置節點","loading":"從騰訊雲獲取節點配置信息"},"instance":{"title":"節點配置","detail":"配置騰訊雲Kubernetes服務中的節點"},"subnet":{"label":"子網","required":"請選擇子網"},"os":{"label":"操作系統"},"disk":{"LOCAL_BASIC":"Local Basic","LOCAL_SSD":"Local SSD","CLOUD_BASIC":"Cloud Basic","CLOUD_PREMIUM":"Cloud Premium","CLOUD_SSD":"Cloud SSD"},"rootSize":{"label":"系統盤大小","placeholder":"例如: 25"},"rootType":{"label":"系統盤類型"},"storageType":{"label":"數據盤類型"},"storageSize":{"label":"數據盤大小","placeholder":"例如: 10"},"bandwidth":{"label":"帶寬","placeholder":"例如: 10"},"nodeCount":{"label":"節點數量","placeholder":"例如: 3","required":"請輸入節點數量","help":"將要創建的騰訊雲Kubernetes服務中所含有的節點數量"},"bandwidthType":{"label":"帶寬類型","hour":"按帶寬使用時長計費","traffic":"按流量計費"},"keyPair":{"label":"密鑰","required":"請選擇密鑰"},"region":{"label":"區域"},"secretId":{"label":"密鑰ID","placeholder":"您的騰訊雲API密鑰ID","required":"請輸入密鑰ID"},"secretKey":{"label":"密鑰","placeholder":"您的騰訊雲API密鑰","provided":"已提供","required":"請輸入密鑰"},"securityGroup":{"label":"安全組","required":"請選擇安全組"},"vpc":{"label":"VPC","required":"請選擇VPC"},"version":{"label":"Kubernetes版本","warning":"“{version}”，此版本不在 Rancher 支持矩陣範圍內，請升級 Rancher 版本。可參考","warningTip":"Rancher 支持矩陣。"},"cidr":{"label":"容器網路 CIDR","placeholder":"例如: 172.16.0.0/16","required":"請輸入容器網路的CIDR"},"zone":{"label":"可用區","required":"請選擇可用區"},"instanceType":{"label":"實例類型","required":"請選擇實例類型"},"regions":{"ap-guangzhou":"廣州","ap-shanghai":"上海","ap-beijing":"北京","ap-chengdu":"成都","ap-chongqing":"重慶","ap-nanjing":"南京","ap-hongkong":"香港","ap-singapore":"新加坡","na-toronto":"多倫多","ap-bangkok":"曼谷","ap-mumbai":"孟買","ap-seoul":"首爾","ap-tokyo":"東京","na-siliconvalley":"矽谷","na-ashburn":"弗吉尼亞","eu-frankfurt":"法蘭克福","eu-moscow":"莫斯科","ap-jakarta":"雅加達","sa-saopaulo":"聖保羅"}}}},
};

const DISKS = ['LOCAL_BASIC', 'LOCAL_SSD', 'CLOUD_BASIC', 'CLOUD_PREMIUM', 'CLOUD_SSD'];

/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName:  '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig',
  app:         service(),
  router:      service(),
  session:     service(),
  intl:        service(),

  layout:            null,
  configField:       'tencentEngineConfig',

  step:               1,
  regionChoices:      [],
  versionChoices:     [],
  osChoices:          [],
  bandWidthChoices:   BAND_WIDTH,
  zoneChoices:        null,
  vpcChoices:         null,
  sgChoices:          null,
  keyChoices:         null,
  allSubnets:         null,
  allInstances:       null,

  isNew:   equal('mode', 'new'),
  editing: equal('mode', 'edit'),

  config: null,
  // config:      alias('cluster.%%DRIVERNAME%%kcsEngineConfig'),

  init() {
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'shared/components/cluster-driver/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);
    this._super(...arguments);

    const lang = get(this, 'session.language');

    get(this, 'intl.locale');
    this.loadLanguage(lang);
    let config      = get(this, 'config');
    let configField = get(this, 'configField');

    if ( !config ) {
      config = this.get('globalStore').createRecord({
        type:           configField,
        clusterCidr:    '172.16.0.0/16',
        clusterVersion: null,
        region:         'ap-guangzhou',
        secretId:       null,
        secretKey:      null,
        zoneId:         null,
        vpcId:          null,
        subnetId:       null,
        instanceType:   'S2.MEDIUM4',
        osName:         'ubuntu18.04.1x86_64',
        sgId:           null,
        rootSize:       100,
        storageSize:    100,
        cvmType:        'PayByHour',
        wanIp:          1,
        isVpcGateway:   0,
        emptyCluster:   false,
        bandwidthType:  'PayByHour',
        bandwidth:      10,
        keyId:          null,
        nodeCount:       1,
      });

      set(this, 'cluster.%%DRIVERNAME%%EngineConfig', config);
      set(this, 'config', config);
    } else {
      if (get(this, 'config.masterVswitchIds')) {
        set(this, 'vswitchId', get(this, 'config.masterVswitchIds')[0] || '');
      }
    }
  },
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    const intl = get(this, 'intl');
    var errors = get(this, 'errors')||[];
    if ( !get(this, 'cluster.name') ) {
      errors.push(intl.t('clusterNew.tencenttke.cluster.name.required'));
    }

    // Add more specific errors

    // Set the array of errors for display,
    // and return true if saving should continue.
    if ( get(errors, 'length') ) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  actions: {
    tencentLogin(cb) {
      setProperties(this, {
        'errors':           null,
        'config.secretId':  (get(this, 'config.secretId') || '').trim(),
        'config.secretKey': (get(this, 'config.secretKey') || '').trim(),
      });

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');

      const secretId = get(this, 'config.secretId');
      const secretKey = get(this, 'config.secretKey');

      if ( !secretId ) {
        errors.push(intl.t('clusterNew.tencenttke.secretId.required'));
      }

      if ( !secretKey ) {
        errors.push(intl.t('clusterNew.tencenttke.secretKey.required'));
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      return all([
        this.fetchRegions(),
        this.fetchVpcs(),
        this.fetchVersions()
      ]).then(() => {
        set(this, 'step', 2);
        cb && cb(true);
      }).catch((error) => {
        console.log(error);

        cb && cb(false);
      });
    },

    loadNodeConfig(cb) {
      setProperties(this, { 'errors': null });

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');

      const {
        clusterCidr, vpcId, nodeCount
      } = get(this, 'config');

      if ( !clusterCidr ) {
        errors.push(intl.t('clusterNew.tencenttke.cidr.required'));
      }

      if ( !vpcId ) {
        errors.push(intl.t('clusterNew.tencenttke.vpc.required'));
      }

      if ( !nodeCount ) {
        errors.push(intl.t('clusterNew.tencenttke.nodeCount.required'));
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      all([
        this.fetchSubnets(),
        this.fetchZones(),
        this.fetchNodeTypes(),
        this.fetchImages(),
      ]).then(() => {
        set(this, 'step', 3);
        cb(true);
      }).catch(() => {
        cb(false);
      });
    },

    loadInstanceConfig(cb) {
      setProperties(this, { 'errors': null });

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');

      const { zoneId, subnetId } = get(this, 'config');

      if ( !zoneId ) {
        errors.push(intl.t('clusterNew.tencenttke.zone.required'));
      }

      if ( !subnetId ) {
        errors.push(intl.t('clusterNew.tencenttke.subnet.required'));
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      return all([
        this.fetchSecurityGroups(),
        this.fetchKeyPairs(),
        this.fetchDiskConfigQuota(),
      ]).then(() => {
        set(this, 'step', 4);
        cb(true);
      }).catch(() => {
        cb(false);
      });
    },

    save(cb) {
      setProperties(this, { 'errors': null });

      const errors = get(this, 'errors') || [];
      const intl = get(this, 'intl');

      const { sgId, keyId } = get(this, 'config') ;

      if ( !sgId ) {
        errors.push(intl.t('clusterNew.tencenttke.securityGroup.required'));
      }

      if ( !keyId ) {
        errors.push(intl.t('clusterNew.tencenttke.keyPair.required'));
      }

      if (errors.length > 0) {
        set(this, 'errors', errors);
        cb();

        return;
      }

      this.send('driverSave', cb);
    },

    cancel(){
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
    },
  },

  languageDidChanged: observer('intl.locale', function() {
    const lang = get(this, 'intl.locale');
    if (lang) {
      this.loadLanguage(lang[0]);
    }

  }),

  loadLanguage(lang) {
    const translation = languages[lang] || languages['en-us'];
    const intl = get(this, 'intl');

    if (intl.addTranslation) {
      intl.addTranslation(lang, 'clusterNew.tencenttke', translation.clusterNew.tencenttke);
    } else {
      intl.addTranslations(lang, translation);
    }

    intl.translationsFor(lang);
    set(this, 'refresh', false);
    next(() => {
      set(this, 'refresh', true);
      set(this, 'lanChanged', +new Date());
    });
  },

  clusterNameDidChange: observer('cluster.name', function() {
    set(this, 'config.clusterName', get(this, 'cluster.name'));
  }),

  subnetIdObserver: observer('selectedZone', 'allSubnets', 'config.vpcId', 'vpcChoices.[]', function() {
    if ( !get(this, 'selectedZone') || !get(this, 'allSubnets') ) {
      return;
    }
    const subnets = get(this, 'allSubnets').filter((subnet) => get(subnet, 'vpcId') === get(this, 'config.vpcId') && get(subnet, 'zone') === get(this, 'selectedZone.queryLabel'));
    const subnetId = get(this, 'config.subnetId');

    if ( get(this, 'isNew') && get(subnets, 'length') ) {
      set(this, 'config.subnetId', get(subnets, 'firstObject.value'));
    } else {
      const found = subnets.findBy('value', subnetId);

      if ( !found ) {
        set(this, 'config.subnetId', null);
      }
    }
  }),

  reloadZones: observer('intl.locale', function() {
    this.fetchZones();
  }),

  regionDidChange: observer('config.region', function() {
    set(this, 'config.vpcId', null);
    this.fetchVpcs();
  }),

  subnetChoices: computed('selectedZone', 'allSubnets', 'config.vpcId', 'vpcChoices.[]', function() {
    if ( !get(this, 'selectedZone') || !get(this, 'allSubnets') ) {
      return;
    }
    const subnets = get(this, 'allSubnets').filter((subnet) => get(subnet, 'vpcId') === get(this, 'config.vpcId') && get(subnet, 'zone') === get(this, 'selectedZone.queryLabel'));

    return subnets;
  }),

  instanceChoices: computed('selectedZone', 'allInstances', function() {
    if ( !get(this, 'selectedZone') || !get(this, 'allInstances') ) {
      return;
    }
    const instances = get(this, 'allInstances').filterBy('zone', get(this, 'selectedZone.queryLabel'));

    const instanceType = get(this, 'config.instanceType');

    const found = instances.findBy('value', instanceType);

    if ( !found ) {
      set(this, 'config.instanceType', null);
    }

    return instances;
  }),

  selectedZone: computed('config.zoneId', 'zoneChoices', function() {
    const zoneChoices = get(this, 'zoneChoices') || [];

    return zoneChoices.findBy('value', get(this, 'config.zoneId'));
  }),

  storageDiskChoices: computed('diskConfigSet.[]', function() {
    return this.getDiskChoices(DATA_DISK)
  }),

  rootDiskChoices: computed('diskConfigSet.[]', function() {
    return this.getDiskChoices(SYSTEM_DISK)
  }),

  maxDataDiskSize: computed('config.storageType', function() {
    const { storageDiskChoices = [] } = this
    const disk = storageDiskChoices.findBy('value', get(this, 'config.storageType'))

    return get(disk, 'maxDiskSize')
  }),

  minDataDiskSize: computed('config.storageType', function() {
    const { storageDiskChoices = [] } = this
    const disk = storageDiskChoices.findBy('value', get(this, 'config.storageType'))

    return get(disk, 'minDiskSize')
  }),

  maxSystemDiskSize: computed('config.rootType', function() {
    const { rootDiskChoices = [] } = this
    const disk = rootDiskChoices.findBy('value', get(this, 'config.rootType')) || {};

    return get(disk, 'maxDiskSize')
  }),

  minSystemDiskSize: computed('config.rootType', function() {
    const { rootDiskChoices = [] } = this
    const disk = rootDiskChoices.findBy('value', get(this, 'config.rootType')) || {};

    return get(disk, 'minDiskSize')
  }),

  regionShowValue: computed('regionChoices.[]', 'config.region', 'intl.locale', function() {
    const intl = get(this, 'intl');

    return intl.t(`clusterNew.tencenttke.regions.${ get(this, 'config.region') }`);
  }),

  vpcShowValue: computed('vpcChoices.[]', 'config.vpcId', 'intl.locale', function() {
    return (get(this, 'vpcChoices').findBy('value', get(this, 'config.vpcId')) || {}).label
  }),

  subnetShowValue: computed('subnetChoices.[]', 'config.subnetId', 'intl.locale', function() {
    return (get(this, 'subnetChoices').findBy('value', get(this, 'config.subnetId')) || {}).label
  }),

  instanceTypeShowValue: computed('allInstances.[]', 'config.instanceType', 'intl.locale', function() {
    return (get(this, 'allInstances').findBy('value', get(this, 'config.instanceType')) || {}).label
  }),

  kubernetesVersionDisabled: computed('intl.locale', 'config.clusterVersion', function() {
    const kubernetesVersion = get(this, 'config.clusterVersion');
    const versionChoices = get(this, 'versionChoices') || [];

    return versionChoices.find(v=>{
      return v.value === kubernetesVersion && v.disabled
    })
  }),

  queryFromTencent(resource, externalParams = {}) {
    const url = `/meta/tke/${resource}`
    const query = Object.assign({}, externalParams, {
      secretId: get(this, 'config.secretId'),
      secretKey: get(this, 'config.secretKey'),
    })

    if(resource !== 'regions'){
      query.regionId = get(this, 'config.region') || '';
    }

    const req = {
      url:     `${ url }?${ this.getQueryParamsString(query) }`,
      method:  'GET',
    };

    return get(this, 'globalStore').rawRequest(req).then((xhr) => {
      const error = get(xhr, 'body.error');

      if ( error )  {
        set(this, 'errors', [error]);

        return reject(xhr);
      }

      return get(xhr, 'body.Response') || JSON.parse(get(xhr, 'body'));
    }).catch((xhr) => {
      let error = '';
      const message = get(xhr, 'body.message')
      if(message && message.includes('TencentCloudSDKError')){
        error = this.tencentCloudSDKError(message)['Message'];
      } else {
        error = get(xhr, 'body.error') || JSON.stringify(xhr);
      }

      set(this, 'errors', [error]);

      return reject(error);
    });
  },

  tencentCloudSDKError(error){
    const body = error.replace('[TencentCloudSDKError] ', '').split(',');
    const obj = {};
    body.forEach(item=>{
      const arr = item.split('=');
      obj[arr[0].trim()] = arr[1].trim();
    })

    return obj;
  },

  fetchRegions() {
    return this.queryFromTencent('regions').then((res) => {
      set(this, 'regionChoices', get(res, 'RegionInstanceSet').map((region) => {
        return {
          label: `clusterNew.tencenttke.regions.${ get(region, 'RegionName') }`,
          value: get(region, 'RegionName')
        };
      }));

      if ( !get(this, 'config.region') && get(this, 'regionChoices.length') ) {
        set(this, 'config.regionId', get(this, 'regionChoices.firstObject.value'));
      }
    })
  },

  fetchVpcs() {
    return this.queryFromTencent('vpcs').then((res) => {
      set(this, 'vpcChoices', get(res, 'VpcSet').map((vpc) => {
        return {
          label: get(vpc, 'VpcName'),
          value: get(vpc, 'VpcId')
        };
      }));

      if ( !get(this, 'config.vpcId') && get(this, 'vpcChoices.length') ) {
        set(this, 'config.vpcId', get(this, 'vpcChoices.firstObject.value'));
      }
    })
  },

  fetchSubnets() {
    return this.queryFromTencent('subnets').then((res) => {
      set(this, 'allSubnets', get(res, 'SubnetSet').map((subnet) => {
        return {
          label: get(subnet, 'SubnetName'),
          value: get(subnet, 'SubnetId'),
          vpcId: get(subnet, 'VpcId'),
          zone:  get(subnet, 'Zone'),
        };
      }));
    })
  },

  fetchVersions() {
    return this.queryFromTencent('versions').then((res) => {
      const versionRange = [ '1.16', '1.17', '1.18', '1.19', '1.20'];
      const versions = get(res, 'VersionInstanceSet').map((key) => {
        const enabled = versionRange.find(v=>{
          return key.Version.startsWith(`${v}.`);
        })

        return {
          label: get(key, 'Version'),
          value: get(key, 'Version'),
          disabled: !enabled,
        };
      });

      if(get(this, 'config.clusterVersion') === null){
        const version = versions.reverse().find(item=>!item.disabled);

        version && set(this, 'config.clusterVersion', version.value);
      }

      set(this, 'versionChoices', versions);

      if ( !get(this, 'config.clusterVersion') && get(this, 'versionChoices.length') ) {
        set(this, 'config.clusterVersion', get(this, 'versionChoices.firstObject.value'));
      }
    });
  },

  fetchNodeTypes() {
    return this.queryFromTencent('instanceTypeConfigs').then((res) => {
      set(this, 'allInstances', get(res, 'InstanceTypeConfigSet').map((instance) => {
        return {
          value:  get(instance, 'InstanceType'),
          label:  `${ get(instance, 'InstanceType') } (CPU ${ get(instance, 'CPU') } Memory ${ get(instance, 'Memory') } GiB)`,
          group:  get(instance, 'InstanceFamily'),
          zone:   get(instance, 'Zone'),
        };
      }));
    });
  },

  fetchImages() {
    return this.queryFromTencent('images').then((res) => {
      set(this, 'osChoices', get(res, 'ImageInstanceSet').filter((image) => {
        const label = get(image, 'Alias');

        return !(label.includes('GPU') || label.includes('BMS') || label.includes('Tencent') || label.includes('TKE-Optimized'))
      }).sort((a, b) => get(a, 'Alias') > get(b, 'Alias') ? -1 : 1).map((image) => {
        return {
          label:  get(image, 'Alias'),
          value:  get(image, 'OsName'),
        };
      }));
    });
  },

  fetchSecurityGroups() {
    return this.queryFromTencent('securityGroups').then((res) => {
      set(this, 'sgChoices', get(res, 'SecurityGroupSet').map((zone) => {
        return {
          label: get(zone, 'SecurityGroupName'),
          value: get(zone, 'SecurityGroupId')
        };
      }));

      if ( !get(this, 'config.sgId') && get(this, 'sgChoices.length') ) {
        set(this, 'config.sgId', get(this, 'sgChoices.firstObject.value'));
      }
    });
  },

  fetchDiskConfigQuota() {
    return this.queryFromTencent('diskConfigQuota', {
      inquiryType: 'INQUIRY_CVM_CONFIG',
      zones:       ((get(this, 'zoneChoices') || []).findBy('value', get(this, 'config.zoneId')) || {}).queryLabel,
      instanceFamilies: (get(this, 'config.instanceType') || '').split('.').get('firstObject')
    }).then((res) => {
      const diskConfigSet = get(res, 'DiskConfigSet').filter((d) => d.DiskChargeType === 'POSTPAID_BY_HOUR')
      const dataDisks = diskConfigSet.filter((d) => d.DiskUsage === DATA_DISK && DISKS.includes(d.DiskType) )
      const systemDisks = diskConfigSet.filter((d) => d.DiskUsage === SYSTEM_DISK && DISKS.includes(d.DiskType))

      if (get(this, 'isNew')) {
        setProperties(this, {
          'config.storageType': get(dataDisks, 'firstObject.DiskType'),
          'config.rootType':    get(systemDisks, 'firstObject.DiskType'),
        })
      }

      set(this, 'diskConfigSet', diskConfigSet)
    });
  },

  fetchKeyPairs() {
    return this.queryFromTencent('keyPairs').then((res) => {
      set(this, 'keyChoices', get(res, 'KeyPairSet').map((key) => {
        return {
          label: get(key, 'KeyName'),
          value: get(key, 'KeyId')
        };
      }));

      if ( !get(this, 'config.keyId') && get(this, 'keyChoices.length') ) {
        set(this, 'config.keyId', get(this, 'keyChoices.firstObject.value'));
      }
    });
  },

  fetchZones() {
    const extraParams = {};

    get(this, 'intl.locale')[0] === 'zh-hans' && set(extraParams, 'language', 'zh-CN');

    return this.queryFromTencent('zones', extraParams).then((res) => {
      set(this, 'zoneChoices', get(res, 'ZoneSet').filterBy('ZoneState', 'AVAILABLE').map((zone) => {
        return {
          label:      get(zone, 'ZoneName'),
          value:      get(zone, 'ZoneId'),
          queryLabel: get(zone, 'Zone')
        };
      }));

      if ( !get(this, 'config.zoneId') && get(this, 'zoneChoices.length') ) {
        set(this, 'config.zoneId', get(this, 'zoneChoices.firstObject.value'));
      }
    });
  },

  getDiskChoices(usage) {
    const { diskConfigSet = [] } = this
    return diskConfigSet.filter((d) => d.DiskUsage === usage && DISKS.includes(d.DiskType)).map((d) => {
      return {
        label:       `clusterNew.tencenttke.disk.${ d.DiskType }`,
        value:       d.DiskType,
        maxDiskSize: d.MaxDiskSize,
        minDiskSize: d.MinDiskSize,
      }
    })
  },

  getQueryParamsString(params, deep = false) {
    const keys = Object.keys(params).sort((a, b) => {
      return a < b ? -1 : 1;
    });

    return keys.map((key) => {
      if (params[key] === undefined) {
        return '';
      }

      return `${ key }${ deep ? encodeURIComponent('=') : '=' }${ encodeURIComponent(params[key]) }`;
    }).join(deep ? encodeURIComponent('&') : '&');
  },
  // Any computed properties or custom logic can go here
});
