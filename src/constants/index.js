
export const TOKEN_KEY = 'token';
export const EXPIRED_KEY = 'expired';
export const UID_KEY = 'uid';
export const USER_KEY = 'user';
export const SEARCH_KEY = 'searchKey';
export const ADDRESS_KEY = 'address';
export const CART_LIST_KEY = 'cartList';
export const IS_NEED_REFESH_USER_INFO_KEY = 'isNeedRefreshUserInfo';
export const OVERSEA_ADDRESS_KEY = 'selfAddressKey';

export const SHARE_TITLE = '小黑店';

export const APPID = 'wx69dfd8295ccb5d73';

export const PRODUCT_LIST_STYLE = ['bigCard', 'smallCard', 'list'];
export const CATEGORY_LIST_STYLE = ['smallCard', 'text', 'textCard', 'bigCard'];

// export const STATUS_TEXT = ['', '未付款', '等待发货', '已发货', '已收货', '退款中', '退款成功', '订单关闭', '系统关闭'];

export const STATUS_TEXT = ['', '等待买家付款', '待发货', '卖家已发货', '已收货', '退款中', '退款成功', '订单关闭', '系统关闭', '', '待成团'];

export const ORDER_STATUS_TEXT = [
    { text: '全部', value: null },
    { text: '待付款', value: 1 },
    { text: '待成团', value: 10 },
    { text: '待发货', value: 2 },
    { text: '已发货', value: 3 },
    { text: '已部分发货', value: 31 },
    { text: '退款中', value: 5 },
    { text: '已完成', value: 4 },
    { text: '订单关闭', value: 7 },
    { text: '系统关闭', value: 8 },
    { text: '退款成功', value: 6 },
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

// const ORDER_TYPE = {
//     0: '普通订单',
//     1: '拼团订单',
//     2: '礼品卡订单',
//     3: '虚拟商品订单',
//     4: '直接支付'
// };

// const SHIPPING_TYPE = {
//     1: '快递物流',
//     2: '自提',
//     3: '上门服务'
// };

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