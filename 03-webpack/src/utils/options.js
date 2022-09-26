/**
 * 前端配置的下拉码表
 */
export default {
  whether: [
    {
      code: 1,
      name: '是'
    },
    {
      code: 0,
      name: '否'
    }
  ],
  DisabledState: [
    {
      code: 1,
      name: '正常'
    },
    {
      code: 0,
      name: '禁用'
    }
  ],
  ShareList: [
    {
      code: 1,
      name: '允许分享'
    },
    {
      code: 0,
      name: '禁止分享'
    }
  ],
  WeekTypes: [
    {
      code: 'WORK',
      name: '工作日'
    },
    {
      code: 'FIX',
      name: '固定日期'
    }
  ],
  CheckedStatus: [
    {
      code: 'SELECTED',
      name: '选中'
    },
    {
      code: 'UNSELECTED',
      name: '不选中'
    },
    {
      code: 'FORCED_SELECTED',
      name: '强制选中'
    }
  ],
  AccountUses: [
    {
      code: 'QUOTED',
      name: '报价时使用'
    },
    {
      code: 'VEHICLE',
      name: '查询车辆信息时使用'
    },
    {
      code: 'RENEWAL',
      name: '续保时使用'
    },
    {
      code: 'ORDER',
      name: '出单时使用'
    },
  ],
  AvailableStatus: [
    {
      code: 'UNKONW',
      name: '未知'
    },
    {
      code: 'AVAILABLE',
      name: '可用'
    },
    {
      code: 'UNAVAILABLE',
      name: '不可用'
    },
  ],
  BorrowStatus: [
    {
      code: 'BORROW',
      name: '借入'
    },
    {
      code: 'LOAN',
      name: '借出'
    },
    {
      code: 'NONE',
      name: '无借用关系'
    },
  ],
  VisibleStatus: [
    {
      code: '0',
      name: '报价时隐藏'
    },
    {
      code: '1',
      name: '报价时可见'
    },
  ],
  ValidStatus: [
    {
      code: '1',
      name: '有效'
    },
    {
      code: '0',
      name: '无效'
    },
  ],
  // LoginClicks: [
  //   {
  //     code: '1',
  //     name: '客户端单点登录'
  //   },
  //   {
  //     code: '0',
  //     name: '管理后台单点登录'
  //   },
  // ],
  Supports: [
    {
      code: 1,
      name: '支持'
    },
    {
      code: 0,
      name: '不支持'
    },
  ],
  OpenStatus: [
    {
      code: 1,
      name: '开启'
    },
    {
      code: 0,
      name: '关闭'
    },
  ],
  WaterMarks: [
    {
      code: 'N',
      name: '无需水印'
    },
    {
      code: 'F',
      name: '姓名+手机号后四位'
    },
    {
      code: 'A',
      name: '姓名+手机号'
    },
  ],
  showStatus: [
    {
      code: 1,
      name: '展示'
    },
    {
      code: 0,
      name: '隐藏'
    },
  ],
  OrderAuditOrgs: [
    {
      code: 'AGENT',
      name: '业务员归属机构'
    },
    {
      code: 'ACCOUNT',
      name: '账号归属机构'
    },
  ],
  DefaultQuery: [
    {
      code: 'MODEL',
      name: '车型查询'
    },
    {
      code: 'CHECK',
      name: '车型校验'
    },
  ],
  QuotaReferPositions: [
    {
      code: 'BEFORE_UNDERWRITING',
      name: '核保前'
    },
    {
      code: 'AFTER_UNDERWRITING',
      name: '核保后'
    },
  ],
  ReviseRateStatus: [
    {
      code: 1,
      name: '支持修改跟单费率'
    },
    {
      code: 0,
      name: '不可修改跟单费率'
    },
  ],
  SMSValidStatus: [
    {
      code: 'NO_VALID',
      name: '无需验证'
    },
    {
      code: 'BEFORE_UNDERWRITING_VALID',
      name: '核保前验证'
    },
    {
      code: 'AFTER_UNDERWRITING_VALID',
      name: '核保后验证'
    },
  ],
  InvoiceFormat: [
    {
      code: 'E_INVOICE',
      name: '电子发票'
    },
    {
      code: 'PAPER_INVOICE',
      name: '纸质发票'
    },
  ],
  InvoiceMaterial: [
    {
      code: 'E_INVOICE',
      name: '电子'
    },
    {
      code: 'PAPER_INVOICE',
      name: '纸质'
    },
  ],
  SMSAisle: [
    {
      code: 'YUNPIAN',
      name: '云片'
    },
    {
      code: 'SUBMAIL',
      name: '赛邮'
    },
  ],
  ContainStatus: [
    {
      code: 1,
      name: '包含'
    },
    {
      code: 0,
      name: '不包含'
    },
  ],
  ChangeStatus: [
    {
      code: 1,
      name: '变更'
    },
    {
      code: 0,
      name: '不变更'
    },
  ],
  DisplayStatus: [
    {
      code: 1,
      name: '显示'
    },
    {
      code: 0,
      name: '不显示'
    },
  ],
  QuotaPrefix: [
    {
      code: 0,
      name: '自定义'
    },
    {
      code: 1,
      name: '使用保险公司名称'
    },
  ],
  IntMoneyRules: [
    {
      code: 0,
      name: '去尾（保留个位）'
    },
    {
      code: 1,
      name: '进一（保留个位）'
    },
    {
      code: 2,
      name: '四舍五入（保留个位）'
    },
    {
      code: 3,
      name: '去尾（保留十位）'
    },
    {
      code: 4,
      name: '进一（保留十位）'
    },
    {
      code: 5,
      name: '四舍五入（保留十位）'
    },
  ],
  DeliveryFields: [
    {
      code: 'P',
      name: '网点自取'
    },
    {
      code: 'E',
      name: '快递'
    },
    {
      code: 'D',
      name: '配送'
    },
  ],
  VehicleService: [
    {
      code: 'US',
      name: '不支持'
    },
    {
      code: 'UC',
      name: '默认不选中'
    },
    {
      code: 'C',
      name: '默认选中'
    },
    {
      code: 'FC',
      name: '强制选中'
    },
  ],
  ClientRequirePhoto: [
    {
      code: 'US',
      name: '不支持客户端影像上传到保险公司'
    },
    {
      code: 'UC',
      name: '默认不选中客户端影像上传到保险公司'
    },
    {
      code: 'C',
      name: '默认选中客户端影像上传到保险公司'
    },
    {
      code: 'FC',
      name: '强制选中客户端影像上传到保险公司'
    },
  ],
  ClientPayWay: [
    {
      code: 'POS',
      name: 'POS机刷卡'
    },
    {
      code: 'WIRELESS_POS',
      name: '无线POS机刷卡'
    },
    {
      code: 'WX',
      name: '微信'
    },
    {
      code: 'ALI',
      name: '支付宝'
    },
    {
      code: 'AGG',
      name: '聚合支付'
    },
    {
      code: 'SMS',
      name: '短信支付'
    },
    {
      code: 'HCZ',
      name: '好车主APP支付'
    },
  ],
  ValidPeriod: [
    {
      code: 'POLICY',
      name: '保单生效日起一年内'
    },
    {
      code: 'TODAY',
      name: '即日起一年内'
    },
    {
      code: 'CUSTOM',
      name: '自定义有效期'
    },
  ],
  ForceTypes: [
    {
      code: 'ALL',
      name: '交强险/车船税'
    },
    {
      code: 'FORCE',
      name: '交强险'
    },
    {
      code: 'TAX',
      name: '车船税'
    },
  ]
}