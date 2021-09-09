
export const TOKEN_KEY = 'token';
export const EXPIRED_KEY = 'expired';
export const UID_KEY = 'uid';
export const USER_KEY = 'user';
export const SEARCH_KEY = 'searchKey';
export const ADDRESS_KEY = 'address';
export const LOCATION_KEY = 'location';
export const AREA_KEY = 'areaKey';
export const CART_LIST_KEY = 'cartList';
export const IS_NEED_REFESH_USER_IKUPPERNFO_KEY = 'isNeedRefreshUserInfo';
export const OVERSEA_ADDRESS_KEY = 'selfAddressKey';
export const USER_INFO_CREATE_TIME = 'userInfoCreateTime';
export const CLOUD_CART_LIST_KEY = 'cloudCartList';

export const SHARE_TITLE = '小黑店';

export const APPID = 'wx69dfd8295ccb5d73';

export const PRODUCT_LIST_STYLE = ['bigCard', 'smallCard', 'list'];
export const CATEGORY_LIST_STYLE = ['smallCard', 'text', 'textCard', 'bigCard'];

export const CONFIG = 'CONFIG';

export const PLATFFORM_ENV = 'CHUXIANG';

export const HOST_ARRAY = [
    { text: 'PEAUNT', value: 'https://api.97866.com/' },
    // { text: 'PEAUNT', value: 'https://aishizhen.com/' },
    { text: 'DEV', value: 'https://hei.dev.97866.com/' },
    { text: 'KUPPER', value: 'https://m.kupper.com.cn/' },
    { text: 'MIBAI', value: 'https://api.mebxy.com/' },
    { text: 'CHUXIANG', value: 'https://api.chuxianghulian.com/' },
    { text: 'AU', value: 'https://au.wpweixin.com/' },
    { text: 'NEW-CUILV', value: 'https://api.jcaik.com/' },  // 翠绿
    { text: 'AUH', value: 'https://wechat.bebridge.cn/' }  // 澳洲香港服務器
];

// export const STATUS_TEXT = ['', '未付款', '等待发货', '已发货', '已收货', '退款中', '退款成功', '订单关闭', '系统关闭'];

export const STATUS_TEXT = ['', '等待买家付款', '待发货', '卖家已发货', '已收货', '退款中', '退款成功', '订单关闭', '系统关闭', '', '待成团'];

export const ORDER_STATUS_TEXT = [
    { text: '全部', value: null },
    { text: '待付款', value: 1 },
    { text: '审核中', value: 1010 },    // 转账支付审核中
    { text: '待成团', value: 10 },
    { text: '待发货', value: 2 },
    { text: '待发货', value: 2002 },    // 已打单
    { text: '已发货', value: 3 },
    { text: '已部分发货', value: 31 },
    { text: '审核驳回', value: 1011 },    // 转账支付审核驳回
    { text: '退款中', value: 5 },
    { text: '已完成', value: 4 },
    { text: '订单关闭', value: 7 },
    { text: '系统关闭', value: 8 },
    { text: '退款成功', value: 6 },
    { text: '待赠送', value: 2001 },  // 礼品卡购买成功
];

export const BARGAIN_STATUS_TEXT = [
    { text: '全部', value: null },
    { text: '进行中', value: 1 },
    { text: '砍价成功', value: 2 },
    { text: '砍价失败', value: 3 }
];

export const MAGUA_ORDER_STATUS_TEXT = [
    { text: '全部', value: null },
    { text: '待付款', value: 1 },
    { text: '待成团', value: 10 },
    { text: '待派单', value: 2 },
    { text: '服务中', value: 3 },
    { text: '服务中', value: 31 },
    { text: '退款中', value: 5 },
    { text: '已完成', value: 4 },
    { text: '订单关闭', value: 7 },
    { text: '系统关闭', value: 8 },
    { text: '退款成功', value: 6 },
];

// export const SHARE_ORDER_STATUS_TEXT = [
//     { text: '待付款', value: 1 },
//     { text: '已支付', value: 2 },
//     { text: '已发货', value: 3 },
//     { text: '已确认', value: 4 },
//     { text: '待成团', value: 10 },
//     { text: '退款中', value: 5 },
//     { text: '已退款', value: 6 },
//     { text: '订单关闭', value: 7 },
//     { text: '系统关闭', value: 8 },
//     { text: '已部分发货', value: 31 },
// ];

export const LOGISTICS_STATUS_TEXT = [
    { text: '暂无信息', value: null },
    { text: '暂无信息', value: 1 },
    { text: '进行中', value: 2 },
    { text: '已完成', value: 3 },
    { text: '错误', value: 4 },
];

// export const SHARE_STATUS_TEXT = [
//     { text: '待处理', value: 1 },
//     { text: '审核中', value: 2 },
//     { text: '未通过', value: 3 },
// ];

export const CONSUM_TEXT = [
    { text: '红包', value: 1 },
    { text: '分享红包后叠加', value: 2 },
    { text: '分销收入', value: 3 },
    { text: '现金提现(储值卡提现)', value: 4 },
    { text: '支付订单', value: 5 },
    { text: '订单退款', value: 6 },
    { text: '分销提现', value: 7 },
    { text: '虚拟币规则', value: 8 },
    { text: '储值卡充值', value: 9 },
];

export const SHARE_STATUS_TEXT = {
    1: '审核中',
    2: '已确认',
    3: '未通过'
};

export const phoneStyle = {
    'iPhone 5': 'iphone5',
    'iPhone X': 'iphoneX'
};
/* 商品列表排版风格 */
export const PRODUCT_LAYOUT_STYLE = ['topImage', 'leftImage', 'rightImage', 'articleImage', 'shareProduct'];

export const CURRENCY = {
    'CNY': '￥',
    'AUD': '$'
};

// export const ORDER_TYPE = {
//     0: '普通订单',
//     1: '拼团订单',
//     2: '礼品卡订单',
//     3: '虚拟商品订单',
//     4: '直接支付'
// };

// expore const PRODUCT_TYPE = {
//     0: '普通商品',
//     1: '虚拟商品',
//     2: '服务'
// };

// export const SHIPPING_TYPE = [
//     { text: '快递', value: 1 },
//     { text: '自提', value: 2 },
//     { text: '上门服务', value: 3 },
//     { text: '送货上门', value: 4 },
//     { text: '寄存', value: 6 }
// ];

// export const CART_TYPE = [
//     { text: '快递', value: 1 },
//     { text: '自提', value: 2 },
//     { text: '服务', value: 3 },
//     { text: '上门', value: 4 },
//     { text: '寄存', value: 6 }
// ];

// export const PRODUCT_STATUS = [
//     { text: '售罄', value: 'sold_out' },
//     { text: '上架', value: 'publish' },
//     { text: '已下架', value: 'unpublished' },
//     { text: '拼团', value: 'groupon_enable' },
//     { text: '限时购', value: 'miaosha_enable' },
//     { text: '会员价', value: 'membership_price_enable' },
//     { text: '会员专属', value: 'membership_dedicated_enable' },
//     { text: '分销', value: 'commission' }
// ];

// const coupon_data_type = {
//     1: '固定日期区间',
//     2: '固定时长' // 领取后计算
// };

// const coupon_status = {
//     1: '已创建，未投放',
//     2: '商家已投放，使用中',
//     3: '已过期',
//     4: '用户已领取',
//     5: '用户已使用',
//     '-1': '已删除'
// };

export const CROWD_STATUS_TEXT = [
    { text: '进行中', value: 1 },
    { text: '助力成功', value: 2 },
    { text: '待支付尾款', value: 3 },
    { text: '已退款', value: 4 }
];

export const USER_STATUS = {
    isUserGetRedPacket: 1,
    isUserHasPayOrder: 2
};

export const PAY_STYLES = [
    { text: '微信', value: 'WEIXIN' },
    { text: '储值卡', value: 'STORE_CARD' }
];


// 订单详情展示结构
export const ORDERINFO = [
    {
        text: '订单号',
        contentKey: 'repo_no'
    },
    {
        text: '黄金类型',
        contentKey: 'gold_type_str'
    },
    {
        text: '克重',
        contentKey: 'weight'
    },
    {
        text: '回收方式',
        contentKey: 'repo_type_str'
    },
    {
        text: '取件信息',
        contentKey: 'address'
    },
    // {
    //     text: '收款账号',
    //     contentKey: 'bank'
    // },
    {
        text: '下单时间',
        contentKey: 'time'
    },
];

// 检测结果-产品
export const CHECKPRODUCT = [
    {
        text: '产品类型',
        contentKey: 'gold_type'
    },
    {
        text: '样品编号',
        contentKey: 'specimen_no'
    },
    {
        text: '来样重量',
        contentKey: 'origin_weight'
    },
    {
        text: '产品成色',
        contentKey: 'golden_quality'
    },
    {
        text: '检测时间',
        contentKey: 'evaluate_time'
    },
];

// 检测结果-价格
export const CHECKPPRICE = [
    {
        text: '实收金价',
        contentKey: 'actual_gold_price'
    },
    {
        text: '来样总额',
        contentKey: 'specimen_amount'
    },
    {
        text: '手续费',
        contentKey: 'service_fee'
    },
    {
        text: '物流费',
        contentKey: 'postage'
    },
    {
        text: '保险费',
        contentKey: 'insurance_fee'
    },
    {
        text: '检测费',
        contentKey: 'evaluate_fee'
    },
];

// 回购记录类型
export const REPO_STATUS = [
    {
        key: 'TYPE_REPO_INCOME',
        value: 14,
        name: '收入',
        income: true,
    },
    {
        key: 'TYPE_REPO_ORDER',
        value: 145,
        name: '订单消费',
        income: false,
    },
    {
        key: 'TYPE_REPO_ORDER_REFUND',
        value: 146,
        name: '订单退款',
        income: true,
    },
    {
        key: 'TYPE_REPO_ORDER_CLOSE',
        value: 149,
        name: '订单关闭',
        income: true,
    },
    {
        key: 'TYPE_REPO_WITHDRAWAL',
        value: 141,
        name: '银行卡提现',
        income: false,
    },
    {
        key: 'TYPE_REPO_DEPOSIT_WITHDRAWAL',
        value: 148,
        name: '寄存金提现',
        income: true,
    },
];

// 寄存记录类型
export const DEPOSIT_STATUS = {
    TYPE_DEPOSIT_INCOME: 15,  // 寄存收入
    TYPE_DEPOSIT_WITHDRAWAL: 151,  // 寄存提取
};

