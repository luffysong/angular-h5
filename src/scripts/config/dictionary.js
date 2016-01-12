window.DICTIONARY_DATA =  {
    AuditStatus: [
        {
            desc: '初始',
            id: 0,
            value: 'DEFAULT',
        },
        {
            desc: '审核中',
            id: 1,
            value: 'PENDING',
        },
        {
            desc: '审核通过',
            id: 2,
            value: 'PASSED',
        },
        {
            desc: '驳回',
            id: 3,
            value: 'REJECTED',
        },
        {
            desc: '删除',
            id: 4,
            value: 'DELETED',
        },
    ],
    WriterRoleEnum: [
        {
            desc: '普通作者',
            id: 0,
            value: 'WRITER',
        },
        {
            desc: '创业者',
            id: 1,
            value: 'ENTREPRENEUR',
        },
        {
            desc: '投资人',
            id: 2,
            value: 'INVESTOR',
        },
        {
            desc: '机构',
            id: 3,
            value: 'ORGANIZATION',
        },
    ],
    EmployeeType: [
        {
            desc: '创始人',
            id: 101,
            value: 'FOUNDER',
        },
        {
            desc: '联合创始人',
            id: 102,
            value: 'CO_FOUNDER',
        },
        {
            desc: '技术',
            id: 103,
            value: 'TECH',
        },
        {
            desc: '设计',
            id: 104,
            value: 'DESIGN',
        },
        {
            desc: '产品',
            id: 105,
            value: 'PRODUCT',
        },
        {
            desc: '运营',
            id: 106,
            value: 'OPERATOR',
        },
        {
            desc: '市场与销售',
            id: 107,
            value: 'SALE',
        },
        {
            desc: '行政、人事及财务',
            id: 108,
            value: 'HR',
        },
        {
            desc: '投资和并购',
            id: 109,
            value: 'INVEST',
        },
        {
            desc: '其他',
            id: 110,
            value: 'OTHER',
        },
    ],
    FundsType: [
        {
            desc: '普通融资',
            id: 0,
            value: 'ORDINARY',
        },
        {
            desc: '极速融资',
            id: 1,
            value: 'SPEED',
        },
    ],
    CompanyOperationStatus: [
        {
            desc: '3个月内上线',
            id: -1,
            value: 'ONLINE_IN_3MONTH',
        },
        {
            desc: '6个月内上线',
            id: -5,
            value: 'ONLINE_IN_6MONTH',
        },
        {
            desc: '运营中',
            id: 0,
            value: 'OPEN',
        },
        {
            desc: '停止运营',
            id: 1,
            value: 'CLOSED',
        },
    ],
    OrgSource: [
        {
            desc: '默认',
            id: 0,
            value: 'DEFAULT',
        },
        {
            desc: '个人投资经历',
            id: 1,
            value: 'USER_INVEST',
        },
        {
            desc: '个人工作经历',
            id: 2,
            value: 'USER_WORK_EXP',
        },
        {
            desc: '公司融资经历',
            id: 3,
            value: 'COM_FINANCE',
        },
        {
            desc: '公司过往投资方',
            id: 4,
            value: 'COM_HISTORY_INVESTOR',
        },
        {
            desc: '完成融资',
            id: 5,
            value: 'FUND_COMPLETE',
        },
        {
            desc: '投资人认证',
            id: 6,
            value: 'INVESTOR_AUDIT',
        },
    ],
    WiseVoteEntityTypeEnum: [
        {
            desc: '创业者',
            id: 1,
            value: 'STARTUP_USER',
        },
        {
            desc: '跟投人',
            id: 2,
            value: 'CO_INVESTOR',
        },
        {
            desc: '创业公司',
            id: 3,
            value: 'STARTUP_COMPANY',
        },
    ],
    OrgType: [
        {
            desc: '一般投资机构',
            id: 1,
            value: 'COMMON',
        },
        {
            desc: '顶级投资机构',
            id: 2,
            value: 'VIP',
        },
    ],
    ChartCategoryEnum: [
        {
            desc: '氪指数',
            id: 0,
            value: 'KR_INDEX',
        },
        {
            desc: 'alexa排名',
            id: 1,
            value: 'ALEXA',
        },
        {
            desc: 'app综合排名',
            id: 2,
            value: 'APP',
        },
        {
            desc: '搜索指数',
            id: 3,
            value: 'SEARCH',
        },
        {
            desc: '微博指数',
            id: 4,
            value: 'WEIBO',
        },
        {
            desc: '媒体指数',
            id: 5,
            value: 'MEDIA',
        },
    ],
    ConfirmStatus: [
        {
            desc: '待确认',
            id: 0,
            value: 'PENDING',
        },
        {
            desc: '已确认',
            id: 1,
            value: 'CONFIRMED',
        },
    ],
    InvestorRoleEnum: [
        {
            desc: '机构投资人',
            id: 0,
            value: 'ORG_INVESTOR',
        },
        {
            desc: '公司投资并购部',
            id: 1,
            value: 'COMPANY_INVEST_DEPT',
        },
        {
            desc: '个人投资人',
            id: 2,
            value: 'PERSONAL_INVESTOR',
        },
    ],
    StartupPositionType: [
        {
            desc: '创始人',
            id: 101,
            value: 'FOUNDER',
        },
        {
            desc: '联合创始人',
            id: 102,
            value: 'CO_FOUNDER',
        },
    ],
    NewsReportAngle: [
        {
            desc: '我们上线了一个新产品',
            id: 0,
            value: 'PRODUCT',
        },
        {
            desc: '我们希望公布融资消息',
            id: 1,
            value: 'FINANCING',
        },
        {
            desc: '我有其他消息希望报道',
            id: 2,
            value: 'OTHER',
        },
    ],
    InvestorType: [
        {
            desc: '非投资人',
            id: 100,
            value: 100,
        },
        {
            desc: '投资人',
            id: 20,
            value: 20,
        },
        {
            desc: '优质投资人',
            id: 10,
            value: 10,
        },
    ],
    InternalEmailTypeEnum: [
        {
            desc: '跟投人完成付款',
            id: 0,
            value: 'CO_INVESTOR_PAYMENT_COMPLETE',
        },
        {
            desc: '跟头人选择线下付款',
            id: 1,
            value: 'UNDER_LINE_PAYMENT_1',
        },
        {
            desc: '跟投人下订单提醒',
            id: 2,
            value: 'CO_INVESTOR_ORDER_REMIND',
        },
        {
            desc: '跟投人因款项不足退款提醒',
            id: 3,
            value: 'CO_INVESTOR_RETURN_PAYMENT',
        },
        {
            desc: '后台订单修改后确认',
            id: 4,
            value: 'MODIFIED_ORDER_CONFIRMED',
        },
        {
            desc: '基金募集预约成功通知',
            id: 5,
            value: 'FUND_PRE_ORDER_SUCCESS',
        },
        {
            desc: 'kr码发放',
            id: 6,
            value: 'KR_CODE',
        },
    ],
    InternalNotificationEnum: [
        {
            desc: '基金募集预约成功通知',
            id: 5,
            value: 'FUND_PRE_ORDER_SUCCESS',
        },
        {
            desc: 'kr码发放',
            id: 6,
            value: 'KR_CODE',
        },
        {
            desc: '创业活动通知',
            id: 7,
            value: 'CHUANG_HUODONG',
        },
        {
            desc: '跟投人认证成功',
            id: 8,
            value: 'CO_INVESTOR_SUCCESS',
        },
    ],
    CoinvestorType: [
        {
            desc: '非跟投人',
            id: 0,
            value: 0,
        },
        {
            desc: '正在实名认证跟投人',
            id: 1,
            value: 1,
        },
        {
            desc: '跟投人',
            id: 2,
            value: 2,
        },
    ],
    CompanyStatus: [
        {
            desc: '初始',
            id: 0,
            value: 'INIT',
        },
        {
            desc: '审核中',
            id: 1,
            value: 'AUDITING',
        },
        {
            desc: '已创建',
            id: 2,
            value: 'CREATED',
        },
        {
            desc: '认领中',
            id: 3,
            value: 'CLAIMING',
        },
        {
            desc: '已认领',
            id: 4,
            value: 'CLAIMED',
        },
    ],
    FundsStatus: [
        {
            desc: '申请融资',
            id: 2,
            value: 'SUBMITTED',
        },
        {
            desc: '挂牌成功',
            id: 3,
            value: 'PASSED',
        },
        {
            desc: '优质项目',
            id: 4,
            value: 'RECOMMENDED',
        },
        {
            desc: '完成融资',
            id: 5,
            value: 'COMPLETED',
        },
        {
            desc: '挂牌失败',
            id: 6,
            value: 'REJECTED',
        },
        {
            desc: '融资已关闭',
            id: 7,
            value: 'CLOSED',
        },
    ],
    CompanyFinancePhase: [
        {
            desc: '未知轮次',
            id: -100,
            value: 'UNKNOWN',
        },
        {
            desc: '非正式轮次',
            id: -50,
            value: 'INFORMAL',
        },
        {
            desc: '未融资',
            id: 0,
            value: 'NONE',
        },
        {
            desc: '天使轮',
            id: 10,
            value: 'ANGEL',
        },
        {
            desc: 'Pre-A轮',
            id: 20,
            value: 'PRE_A',
        },
        {
            desc: 'A轮',
            id: 30,
            value: 'A',
        },
        {
            desc: 'A+轮',
            id: 35,
            value: 'A_PLUS',
        },
        {
            desc: 'B轮',
            id: 40,
            value: 'B',
        },
        {
            desc: 'B+轮',
            id: 45,
            value: 'B_PLUS',
        },
        {
            desc: 'C轮',
            id: 50,
            value: 'C',
        },
        {
            desc: 'D轮',
            id: 60,
            value: 'D',
        },
        {
            desc: 'E轮及以后',
            id: 70,
            value: 'E',
        },
        {
            desc: '并购',
            id: 100,
            value: 'ACQUIRED',
        },
        {
            desc: '上市',
            id: 110,
            value: 'IPO',
        },
    ],
    OrgPositionType: [
        {
            desc: '创始合伙人',
            id: 201,
            value: 'FOUNDER_PARTNER',
        },
        {
            desc: '董事长',
            id: 202,
            value: 'CHAIRMAN',
        },
        {
            desc: 'CEO',
            id: 203,
            value: 'CEO',
        },
        {
            desc: '管理合伙人',
            id: 204,
            value: 'MANAGE_PARTNER',
        },
        {
            desc: '资深合伙人',
            id: 205,
            value: 'SENIOR_PARTNER',
        },
        {
            desc: '合伙人',
            id: 206,
            value: 'PARTNER',
        },
        {
            desc: '风险合伙人',
            id: 207,
            value: 'VENTURE_PARTNER',
        },
        {
            desc: '董事',
            id: 208,
            value: 'DIRECTOR',
        },
        {
            desc: '总经理',
            id: 209,
            value: 'GM',
        },
        {
            desc: '副总经理',
            id: 2010,
            value: 'VICE_GM',
        },
        {
            desc: '董事总经理',
            id: 2011,
            value: 'MANAGING_DIRECTOR',
        },
        {
            desc: '高级副总裁',
            id: 2012,
            value: 'SENIOR_VP',
        },
        {
            desc: '副总裁',
            id: 2013,
            value: 'VP',
        },
        {
            desc: '投资总监',
            id: 2014,
            value: 'CIO',
        },
        {
            desc: '高级投资经理',
            id: 2015,
            value: 'SENIOR_INVEST_MANAGER',
        },
        {
            desc: '投资经理',
            id: 2016,
            value: 'INVEST_MANAGER',
        },
        {
            desc: '高级分析师',
            id: 2017,
            value: 'SENIOR_ANALYST',
        },
        {
            desc: '分析师',
            id: 2018,
            value: 'ANALYST',
        },
    ],
    RnvInvestorInfo: [
        {
            desc: '我的金融资产超过100万元',
            id: 1,
            value: 'V1_1',
        },
        {
            desc: '我的年收入超过30万元',
            id: 2,
            value: 'V1_2',
        },
        {
            desc: '我是专业的风险投资人',
            id: 3,
            value: 'V1_3',
        },
    ],
    LeadInvestorType: [
        {
            desc: '不是领投人',
            id: 0,
            value: 0,
        },
        {
            desc: '领投人',
            id: 1,
            value: 1,
        },
    ],
    IdentityCardType: [
        {
            desc: '身份证',
            id: 1,
            value: 'IDCARD',
        },
        {
            desc: '护照',
            id: 2,
            value: 'PASSPORT',
        },
    ],
    FaBindingStatus: [
        {
            desc: '初步绑定',
            id: 10,
            value: 'INIT',
        },
        {
            desc: '开启融资',
            id: 20,
            value: 'FUNDING',
        },
        {
            desc: '交割中',
            id: 30,
            value: 'NEGOTIATING',
        },
        {
            desc: '暂停中',
            id: 40,
            value: 'PAUSED',
        },
        {
            desc: '已成功',
            id: 50,
            value: 'SUCCESS',
        },
        {
            desc: '已撤销',
            id: 60,
            value: 'CANCELED',
        },
    ],
    InvestorFollowedIndustry: [
        {
            desc: '电子商务',
            id: 1,
            value: 'E_COMMERCE',
        },
        {
            desc: '社交网络',
            id: 2,
            value: 'SOCIAL_NETWORK',
        },
        {
            desc: '智能硬件',
            id: 5,
            value: 'INTELLIGENT_HARDWARE',
        },
        {
            desc: '媒体门户',
            id: 6,
            value: 'MEDIA',
        },
        {
            desc: '工具软件',
            id: 7,
            value: 'SOFTWARE',
        },
        {
            desc: '消费生活',
            id: 8,
            value: 'CONSUMER_LIFESTYLE',
        },
        {
            desc: '金融',
            id: 9,
            value: 'FINANCE',
        },
        {
            desc: '医疗健康',
            id: 10,
            value: 'MEDICAL_HEALTH',
        },
        {
            desc: '企业服务',
            id: 11,
            value: 'SERVICE_INDUSTRIES',
        },
        {
            desc: '旅游户外',
            id: 12,
            value: 'TRAVEL_OUTDOORS',
        },
        {
            desc: '房产家居',
            id: 13,
            value: 'PROPERTY_AND_HOME_FURNISHINGS',
        },
        {
            desc: '数字娱乐',
            id: 14,
            value: 'CULTURE_SPORTS_ART',
        },
        {
            desc: '在线教育',
            id: 15,
            value: 'EDUCATION_TRAINING',
        },
        {
            desc: '汽车交通',
            id: 16,
            value: 'AUTO',
        },
        {
            desc: '移动互联网',
            id: 17,
            value: 'MOBILE_INTERNET',
        },
        {
            desc: 'O2O',
            id: 18,
            value: 'O2O',
        },
        {
            desc: '物流',
            id: 19,
            value: 'LOGISTICS',
        },
        {
            desc: '其他',
            id: 0,
            value: 'OTHER',
        },
    ],
    CompanyIndustry: [
        {
            desc: '电子商务',
            id: 1,
            value: 'E_COMMERCE',
        },
        {
            desc: '社交网络',
            id: 2,
            value: 'SOCIAL_NETWORK',
        },
        {
            desc: '智能硬件',
            id: 5,
            value: 'INTELLIGENT_HARDWARE',
        },
        {
            desc: '媒体门户',
            id: 6,
            value: 'MEDIA',
        },
        {
            desc: '工具软件',
            id: 7,
            value: 'SOFTWARE',
        },
        {
            desc: '消费生活',
            id: 8,
            value: 'CONSUMER_LIFESTYLE',
        },
        {
            desc: '金融',
            id: 9,
            value: 'FINANCE',
        },
        {
            desc: '医疗健康',
            id: 10,
            value: 'MEDICAL_HEALTH',
        },
        {
            desc: '企业服务',
            id: 11,
            value: 'SERVICE_INDUSTRIES',
        },
        {
            desc: '旅游户外',
            id: 12,
            value: 'TRAVEL_OUTDOORS',
        },
        {
            desc: '房产家居',
            id: 13,
            value: 'PROPERTY_AND_HOME_FURNISHINGS',
        },
        {
            desc: '数字娱乐',
            id: 14,
            value: 'CULTURE_SPORTS_ART',
        },
        {
            desc: '在线教育',
            id: 15,
            value: 'EDUCATION_TRAINING',
        },
        {
            desc: '汽车交通',
            id: 16,
            value: 'AUTO',
        },
        {
            desc: '其他',
            id: 0,
            value: 'OTHER',
        },
        {
            desc: '物流',
            id: 19,
            value: 'LOGISTICS',
        },
        {
            desc: '非TMT',
            id: 20,
            value: 'NON_TMT',
        },
    ],
    FinancePhase: [
        {
            desc: '天使轮',
            id: 10,
            value: 'ANGEL',
        },
        {
            desc: 'Pre-A轮',
            id: 20,
            value: 'PRE_A',
        },
        {
            desc: 'A轮',
            id: 30,
            value: 'A',
        },
        {
            desc: 'A+轮',
            id: 35,
            value: 'A_PLUS',
        },
        {
            desc: 'B轮',
            id: 40,
            value: 'B',
        },
        {
            desc: 'B+轮',
            id: 45,
            value: 'B_PLUS',
        },
        {
            desc: 'C轮',
            id: 50,
            value: 'C',
        },
        {
            desc: 'D轮',
            id: 60,
            value: 'D',
        },
        {
            desc: 'E轮及以后',
            id: 70,
            value: 'E',
        },
        {
            desc: '并购',
            id: 100,
            value: 'ACQUIRED',
        },
        {
            desc: '上市',
            id: 110,
            value: 'IPO',
        },
    ],
    KrIndexFinancePhase: [
        {
            desc: '天使轮',
            id: 10,
            value: 'ANGEL',
        },
        {
            desc: 'Pre-A轮',
            id: 20,
            value: 'PRE_A',
        },
        {
            desc: 'A轮',
            id: 30,
            value: 'A',
        },
        {
            desc: 'B轮',
            id: 40,
            value: 'B',
        },
        {
            desc: 'C轮',
            id: 50,
            value: 'C',
        },
        {
            desc: 'D轮',
            id: 60,
            value: 'D',
        },
        {
            desc: 'E轮及以后',
            id: 70,
            value: 'E',
        },
        {
            desc: '并购',
            id: 100,
            value: 'ACQUIRED',
        },
        {
            desc: '上市',
            id: 110,
            value: 'IPO',
        },
    ],
    SearchSortEnum: [
        {
            desc: '按氪指数排序',
            id: 0,
            value: 'KR_INDEX',
        },
        {
            desc: '按爆发力排序',
            id: 1,
            value: 'INCREASE',
        },
    ],
    ComPositionType: [
        {
            desc: '创始人',
            id: 101,
            value: 'FOUNDER',
        },
        {
            desc: '联合创始人',
            id: 102,
            value: 'CO_FOUNDER',
        },
        {
            desc: '技术',
            id: 103,
            value: 'TECH',
        },
        {
            desc: '设计',
            id: 104,
            value: 'DESIGN',
        },
        {
            desc: '产品',
            id: 105,
            value: 'PRODUCT',
        },
        {
            desc: '运营',
            id: 106,
            value: 'OPERATOR',
        },
        {
            desc: '市场与销售',
            id: 107,
            value: 'SALE',
        },
        {
            desc: '行政、人事及财务',
            id: 108,
            value: 'HR',
        },
        {
            desc: '投资和并购',
            id: 109,
            value: 'INVEST',
        },
        {
            desc: '其他',
            id: 110,
            value: 'OTHER',
        },
    ],
    SPOther: [
        {
            desc: '团队需要进一步加强',
            id: 1,
            value: 1,
        },
        {
            desc: '与我们现阶段投资方向不匹配',
            id: 2,
            value: 2,
        },
    ],
    CompanySource: [
        {
            desc: '创建公司',
            id: 1,
            value: 'CREATION',
        },
        {
            desc: '快速创建公司',
            id: 2,
            value: 'FAST_CREATION',
        },
        {
            desc: '个人工作经历创建',
            id: 3,
            value: 'INDIVIDUAL_WORK_EXPERIENCE_CREATION',
        },
        {
            desc: '个人投资经历创建',
            id: 4,
            value: 'INDIVIDUAL_INVEST_EXPERIENCE_CREATION',
        },
        {
            desc: '公司融资经历创建',
            id: 5,
            value: 'COMPANY_FINANCE_EXPERIENCE_CREATION',
        },
        {
            desc: '个人创业经历创建',
            id: 6,
            value: 'INDIVIDUAL_STARTUP_EXPERIENCE_CREATION',
        },
        {
            desc: '运营创建',
            id: 7,
            value: 'BUSINESS_CREATION',
        },
        {
            desc: '批量导入',
            id: 8,
            value: 'BULK_IMPORT_CREATION',
        },
        {
            desc: '过往投资方创建',
            id: 9,
            value: 'PREVIOUS_INVEST_CREATION',
        },
        {
            desc: '完成融资时创建',
            id: 10,
            value: 'FINISHED_FINANCE_CREATION',
        },
        {
            desc: '寻求报道时创建',
            id: 11,
            value: 'NEWS_REPORT_APPLICATION_CREATION',
        },
        {
            desc: '活动报名',
            id: 12,
            value: 'ACTIVITY_CREATION',
        },
        {
            desc: 'h5创建',
            id: 13,
            value: 'H5_CREATION',
        },
        {
            desc: 'FA创建',
            id: 14,
            value: 'FA_CREATION',
        },
        {
            desc: '投资人认证',
            id: 15,
            value: 'INVESTOR_AUDIT',
        },
    ],
    CurrencyUnit: [
        {
            desc: '人民币',
            id: 1,
            value: 'CNY',
        },
        {
            desc: '美元',
            id: 2,
            value: 'USD',
        },
    ],
    UserStatus: [
        {
            desc: '默认状态',
            id: 0,
            value: 0,
        },
        {
            desc: '已邀请',
            id: 1,
            value: 1,
        },
        {
            desc: '已激活',
            id: 2,
            value: 2,
        },
    ],
    SPBpAdvice: [
        {
            desc: '商业模式表述及逻辑需更清晰',
            id: 1,
            value: 1,
        },
        {
            desc: '考虑项目阶段， 需要运营数据支持',
            id: 2,
            value: 2,
        },
    ],
    PermissionLevel: [
        {
            desc: '申请后可见',
            id: 5,
            value: 5,
        },
        {
            desc: '优质投资人可见',
            id: 10,
            value: 10,
        },
        {
            desc: '普通投资人可见',
            id: 20,
            value: 20,
        },
        {
            desc: '任何人可见',
            id: 100,
            value: 100,
        },
    ],
    SPModel: [
        {
            desc: '切入点与用户痛点存在疑问',
            id: 1,
            value: 1,
        },
        {
            desc: '产品迭代路径需要进一步考虑',
            id: 2,
            value: 2,
        },
        {
            desc: '核心竞争力优势不明显',
            id: 3,
            value: 3,
        },
        {
            desc: '市场规模和潜在变现能力存疑',
            id: 4,
            value: 4,
        },
    ],
    WorkPositionType: [
        {
            desc: '技术',
            id: 103,
            value: 'TECH',
        },
        {
            desc: '设计',
            id: 104,
            value: 'DESIGN',
        },
        {
            desc: '产品',
            id: 105,
            value: 'PRODUCT',
        },
        {
            desc: '运营',
            id: 106,
            value: 'OPERATOR',
        },
        {
            desc: '市场与销售',
            id: 107,
            value: 'SALE',
        },
        {
            desc: '行政、人事及财务',
            id: 108,
            value: 'HR',
        },
        {
            desc: '投资和并购',
            id: 109,
            value: 'INVEST',
        },
        {
            desc: '其他',
            id: 110,
            value: 'OTHER',
        },
    ],
    Source: [
        {
            desc: '投资方',
            id: 2,
            value: 'INVESTOR',
        },
        {
            desc: '融资方',
            id: 4,
            value: 'FINANCIER',
        },
    ],
    FundsPhase: [
        {
            desc: '天使轮',
            id: 10,
            value: 'ANGEL',
        },
        {
            desc: 'Pre-A轮',
            id: 20,
            value: 'PRE_A',
        },
        {
            desc: 'A轮',
            id: 30,
            value: 'A',
        },
        {
            desc: 'B轮',
            id: 40,
            value: 'B',
        },
        {
            desc: 'C轮',
            id: 50,
            value: 'C',
        },
        {
            desc: 'D轮',
            id: 60,
            value: 'D',
        },
        {
            desc: 'E轮及以后',
            id: 70,
            value: 'E',
        },
    ],
    EntityType: [
        {
            desc: '个人',
            id: 1,
            value: 'INDIVIDUAL',
        },
        {
            desc: '投资机构',
            id: 2,
            value: 'ORGANIZATION',
        },
        {
            desc: '公司',
            id: 3,
            value: 'COMPANY',
        },
    ],
    SPOption: [
        {
            desc: 'BP建议',
            id: 1,
            value: 1,
        },
        {
            desc: '模式',
            id: 2,
            value: 2,
        },
        {
            desc: '其他',
            id: 3,
            value: 3,
        },
    ],
};
