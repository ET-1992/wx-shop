export const TOKEN_KEY = 'token';
export const EXPIRED_KEY = 'expired';
export const UID_KEY = 'uid';
export const USER_KEY = 'user';
export const SEARCH_KEY = 'searchKey';
export const ADDRESS_KEY = 'address';
export const CART_LIST_KEY = 'cartList';
export const IS_NEED_REFESH_USER_INFO_KEY = 'isNeedRefreshUserInfo';

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
    { text: '已完成', value: 4 },
    { text: '已部分发货', value: 31 },
    { text: '申请退款', value: 5 },
    { text: '订单关闭', value: 7 },
    { text: '系统关闭', value: 8 },
    { text: '退款成功', value: 6 },
];

export const LOGISTICS_STATUS_TEXT = [
    { text: '暂无该物流信息', value: null },
    { text: '暂无该物流信息', value: 1 },
    { text: '正在运输', value: 2 },
    { text: '已签收', value: 3 },
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
export const PRODUCT_LAYOUT_STYLE = ['topImage', 'leftImage', 'rightImage', 'articleImage'];