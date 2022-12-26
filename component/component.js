/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
import ClusterDriver from 'shared/mixins/cluster-driver';
// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
const LANGUAGE;
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

const languages = LANGUAGE;
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

const DISKS = ['LOCAL_BASIC', 'LOCAL_SSD', 'CLOUD_BASIC', 'CLOUD_PREMIUM', 'CLOUD_SSD', 'CLOUD_BSSD'];

const OS_IMAGE = [
  {
      "Alias": "CentOS 7.2 64bit",
      "Arch": "amd64",
      "ImageId": "img-rkiynh11",
      "OsCustomizeType": "GENERAL",
      "OsName": "centos7.2x86_64",
      "SeriesName": "centos7.2x86_64",
  },
  {
      "Alias": "CentOS 7.6 64bit",
      "Arch": "amd64",
      "ImageId": "img-9qabwvbn",
      "OsCustomizeType": "GENERAL",
      "OsName": "centos7.6.0_x64",
      "SeriesName": "centos7.6.0_x64",
  },
  {
      "Alias": "TencentOS Server 2.4",
      "Arch": "amd64",
      "ImageId": "img-hdt9xxkt",
      "OsCustomizeType": "GENERAL",
      "OsName": "tlinux2.4x86_64",
      "SeriesName": "TencentOS Server 2.4",
  },
  {
      "Alias": "Ubuntu Server 16.04.1 LTS 64bit",
      "Arch": "amd64",
      "ImageId": "img-4wpaazux",
      "OsCustomizeType": "GENERAL",
      "OsName": "ubuntu16.04.1 LTSx86_64",
      "SeriesName": "ubuntu16.04.1 LTSx86_64",
  },
  {
      "Alias": "Ubuntu Server 18.04.1 LTS 64bit",
      "Arch": "amd64",
      "ImageId": "img-pi0ii46r",
      "OsCustomizeType": "GENERAL",
      "OsName": "ubuntu18.04.1x86_64",
      "SeriesName": "ubuntu18.04.1x86_64",
  },
  {
      "Alias": "Ubuntu Server 20.04.1 LTS 64bit",
      "Arch": "amd64",
      "ImageId": "img-22trbn9x",
      "OsCustomizeType": "GENERAL",
      "OsName": "ubuntu20.04x86_64",
      "SeriesName": "ubuntu20.04x86_64",
  },
  {
      "Alias": "CentOS 7.8 64bit",
      "Arch": "amd64",
      "ImageId": "img-3la7wgnt",
      "OsCustomizeType": "GENERAL",
      "OsName": "centos7.8.0_x64",
      "SeriesName": "centos7.8.0_x64",
  },
  {
      "Alias": "CentOS 8.0 64bit",
      "Arch": "amd64",
      "ImageId": "img-25szkc8t",
      "OsCustomizeType": "GENERAL",
      "OsName": "centos8.0x86_64",
      "SeriesName": "centos8.0x86_64",
  },
  {
      "Alias": "TencentOS Server 2.4 (TK4)",
      "Arch": "amd64",
      "ImageId": "img-9axl1k53",
      "OsCustomizeType": "GENERAL",
      "OsName": "tlinux2.4(tkernel4)x86_64",
      "SeriesName": "TencentOS Server 2.4 (TK4)",
      "Status": "online"
  },
  {
      "Alias": "TencentOS Server 3.1 (TK4)",
      "Arch": "amd64",
      "ImageId": "img-eb30mz89",
      "OsCustomizeType": "GENERAL",
      "OsName": "tlinux3.1x86_64",
      "SeriesName": "TencentOS Server 3.1 (TK4)",
  }
];

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

      this.getImages();

      all([
        this.fetchSubnets(),
        this.fetchZones(),
        this.fetchNodeTypes(),
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
    const disk = storageDiskChoices.findBy('value', get(this, 'config.storageType')) || {};

    return get(disk, 'maxDiskSize')
  }),

  minDataDiskSize: computed('config.storageType', function() {
    const { storageDiskChoices = [] } = this
    const disk = storageDiskChoices.findBy('value', get(this, 'config.storageType')) || {};

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

    return get(disk, 'minDiskSize');
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
      return v.value === kubernetesVersion && !v.rancherEnabled
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
      const versionRange = ['1.23', '1.24'];
      const versions = get(res, 'VersionInstanceSet').map((key) => {
        const enabled = versionRange.find(v=>{
          return key.Version.startsWith(`${v}.`);
        })

        return {
          label: get(key, 'Version'),
          value: get(key, 'Version'),
          rancherEnabled: !!enabled
        };
      });

      if(get(this, 'config.clusterVersion') === null){
        const version = versions.reverse().find(item=>item.rancherEnabled);

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

  getImages() {
    const out = [];

    OS_IMAGE.forEach(image=>{
      out.push({
        label:  get(image, 'Alias'),
        value:  get(image, 'OsName'),
      })
    });

    set(this, 'osChoices', out.sort((a, b) => a.label < b.label ? -1 : 1));
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
