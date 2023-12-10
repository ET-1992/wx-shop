/* eslint-disable prefer-promise-reject-errors */
import { TOKEN_KEY, EXPIRED_KEY, USER_KEY, USER_STATUS, CONFIG, PLATFFORM_ENV } from 'constants/index';
import api from 'utils/api';
import { login, checkSession, getSetting, authorize } from 'utils/wxp';
import wxProxy from 'utils/wxProxy';
import wxStorage from 'utils/wxStorage';

function formatNumber(n) {
    let x;
    x = n.toString();
    return x[1] ? x : '0' + x;
}

export function formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

export function formatConfirmTime(seconds) {
    let remainSeconds = seconds;
    const day = Math.floor(remainSeconds / (24 * 60 * 60));
    remainSeconds = remainSeconds % (24 * 60 * 60);
    const hour = Math.floor(remainSeconds / (60 * 60));
    remainSeconds = remainSeconds % (60 * 60);
    const minute = Math.floor(remainSeconds / 60);
    const second = remainSeconds % 60;
    const unit = ['天', '时', '分', '秒'];
    const dateStr = [day, hour, minute, second].reduce((str, value, index) => {
        let dateStr = str;
        if (value) {
            dateStr = dateStr + value + unit[index];
        }
        return dateStr;
    }, '');
    return { remainTime: dateStr, remainSecond: seconds };
}
export function formatTimer(val, hours) {
    if (val) {
        const dateTimer = new Date(val * 1000);
        const y = dateTimer.getFullYear();
        let M = dateTimer.getMonth() + 1;
        let d = dateTimer.getDate();
        let h = dateTimer.getHours();
        let m = dateTimer.getMinutes();
        M = M >= 10 ? M : '0' + M;
        d = d >= 10 ? d : '0' + d;
        h = h >= 10 ? h : '0' + h;
        m = m >= 10 ? m : '0' + m;
        if (hours) {
            return y + '-' + M + '-' + d + ' ' + h + ':' + m;
        } else {
            return y + '-' + M + '-' + d;
        }
    }
}
/* 适配微信获取用户数据新规则 并用缓存控制接口请求次数 */
export function getUserProfile() {
    return new Promise((resolve, reject) => {
        const isExpired = wxStorage.isExpired(USER_KEY);
        if (isExpired) {
            wx.getUserProfile({
                desc: 'getUserInfo',
                success: async (res) => {
                    try {
                        const { user } = await api.hei.getUserProfile({ user: res.userInfo });
                        wxStorage.set({ key: USER_KEY, value: user, expiredTime: 24 * 60 * 60 * 1000, mode: 'second' });
                        resolve(user);
                    } catch (e) {
                        wx.showModal({
                            title: '温馨提示',
                            content: e.errMsg,
                            showCancel: false
                        });
                        reject();
                    }
                },
                fail: () => {
                    wx.showModal({
                        title: '温馨提示',
                        content: '需授权后操作',
                        showCancel: false
                    });
                    reject();
                }
            });
        }
        else {
            const user = wxStorage.get(USER_KEY);
            resolve(user);
        }
    });
}
export function getAgainTokenForInvalid() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('获取code');
            const { code } = await login();
            console.log('获取token');
            const { user, access_token, expired_in } = await api.hei.silentLogin({ code });
            const expiredTime = expired_in * 1000 + Date.now();
            wx.setStorageSync(USER_KEY, user);
            wx.setStorageSync(TOKEN_KEY, access_token);
            wx.setStorageSync(EXPIRED_KEY, expiredTime);
            resolve(access_token);
        } catch (e) {
            console.log(e, 'getAgainTokenForInvalid');
            resolve(null);
        }
    });
}

export async function getAgainUserForInvalid({ encryptedData, iv }) {
    return new Promise(async (resolve, reject) => {
        const user = getUserInfo();
        if (!user) {
            try {
                const data = await api.hei.getUserInfo({
                    encrypted_data: encryptedData,
                    iv,
                });
                if (data) {
                    wx.setStorageSync(USER_KEY, data.user);
                }
                resolve(data.user);
            } catch (e) {
                console.log(e, 'getAgainUserForInvalid');
                resolve(null);
            }
        }
        resolve(user);
    });
}

export function getToken() {
    let token = wx.getStorageSync(TOKEN_KEY);
    const expiredTime = wx.getStorageSync(EXPIRED_KEY);
    if (!token || expiredTime <= Date.now()) {
        token = null;
    }
    return token;
}

export function getUserInfo() {
    let user = wx.getStorageSync(USER_KEY);
    const { expired, openid } = user;
    if (expired || !openid) {
        user = null;
    }
    return user;
}

export function checkNumber(value) {
    const reg = /^\d+(\.\d+)?$/;
    return reg.test(value);
}
export function checkPhone(value) {
    const reg = /^(1)\d{10}$/;
    return reg.test(value);
}
export function checkQQ(value) {
    const reg = /^([1-9][0-9]{4})|([0-9]{6,10})$/;
    return reg.test(value);
}

export function checkEmail(value) {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(value);
}

export function checkIdNameNum(value) {
    return value.toString().length === 18;
}

export function getNodeInfo(id, obj = {}, isComponent, ctx) {
    return new Promise((resolve, reject) => {
        const defaultObj = {
            dataset: true,
            size: true,
            scrollOffset: true,
            rect: true,
            ...obj
        };
        const query = isComponent ? wx.createSelectorQuery().in(ctx) : wx.createSelectorQuery();
        query.select(`#${id}`).fields(defaultObj, (res) => {
            resolve(res);
        }).exec();
    });
}

// 绘制文本 返回数组 控制文本换行
export function autoDrawText(opt = {}) {
    const { ctx, text, maxWidth, maxLine } = opt;
    let textRow = [];
    let n = 0;

    for (let i = 0; i < text.length; i++) {
        const text_ = text.substring(n, i);
        if (ctx.measureText(text_).width > maxWidth) {
            textRow.push(text_);
            n = i;
        }
    }
    textRow.push(text.substring(n, text.length));
    if (maxLine) {
        if (textRow.length > maxLine) {
            textRow = textRow.slice(0, maxLine);
            let text__ = textRow[maxLine - 1];
            text__ = text__.substring(0, text__.length - 2) + '...';
            textRow[maxLine - 1] = text__;
        }
    }
    return textRow;
}

// 生成海报处理函数 花生平台写死 其他平台不动
export function imgToHttps(url = '') {
    const app = getApp();
    const { cdn_host, download_host } = app.globalData.config;

    return download_host ? url.replace(cdn_host, download_host) : url;
}

export function updateTabbar({ tabbarStyleDisable = false, tabbarCartNumDisable = false, pageKey = '' }) {
    const app = getApp();
    const { cartIndex } = app.globalData;
    const config =  wx.getStorageSync(CONFIG);

    const { tabbar } = config;

    if (tabbar) {
        const { list = [], color, selectedColor, backgroundColor, borderStyle } = tabbar;

        const tabbarItem = list.find((item) => {
            return item.page_key === pageKey;
        });

        // 判定当前是否tabbar页
        if (tabbarItem) {
            console.log('当前是tabbar页：' + pageKey);

            // 更新tabbar样式
            if (!tabbarStyleDisable) {
                wx.setTabBarStyle({
                    color,
                    selectedColor,
                    backgroundColor,
                    borderStyle
                });

                list.forEach((item, index) => {
                    const { iconPath, selectedIconPath, text } = item;
                    wx.setTabBarItem({
                        index,
                        text,
                        iconPath,
                        selectedIconPath
                    });
                });
            }

            // 更新购物车红点
            if (cartIndex !== -1 && !tabbarCartNumDisable) {
                const CART_NUM  = wx.getStorageSync('CART_NUM');
                const index = Number(cartIndex);
                const text = CART_NUM.toString();
                if (!text || text === '0') {
                    wx.removeTabBarBadge({
                        index
                    });
                } else {
                    wx.setTabBarBadge({
                        index,
                        text
                    });
                }
            }
        }
    }
}

export function textToValue(array = [], text = '') {
    const filterValue =  array.filter((item) => {
        return item.text === text;
    });
    return (filterValue && filterValue[0] && filterValue[0].value) || array[0].value;
}

export function valueToText(array = [], value = null) {
    const filterValue =  array.filter((item) => {
        return item.value === value;
    });
    return (filterValue && filterValue[0] && filterValue[0].text) || array[0].text;
}

export function auth({ scope, ctx, isFatherControl = false, ...opts }) {
    return new Promise(async (resolve) => {
        const setting = await getSetting();
        if (!setting.authSetting[scope]) {
            try {
                await authorize({ scope });
                resolve(true);
            } catch (e) {
                ctx.beforeAutoShowModal && ctx.beforeAutoShowModal(scope);
                ctx.setData({
                    'authModal': {
                        isFatherControl,
                        title: '温馨提示',
                        isShowModal: true,
                        body: '该操作需要用户授权',
                        type: 'button',
                        buttonData: {
                            opentype: scope === 'scope.userInfo' ? 'getUserInfo' : 'openSetting'
                        },
                        confirmText: '确定',
                        cancelText: '取消',
                    }
                });
                resolve(false);
            }
        } else {
            resolve(true);
        }
    });
}

export function authGetUserInfo({ ctx, isFatherControl = false }) {
    ctx.setData({
        'authModal': {
            isFatherControl,
            title: '温馨提示',
            isShowModal: true,
            body: '该操作需要获取用户头像',
            type: 'button',
            buttonData: {
                opentype: 'getUserInfo'
            },
            confirmText: '确定',
            cancelText: '取消',
        }
    });
}

export function parseScene(scene) {
    let query_ = {};
    let sceneArray = [];
    if (scene.indexOf('&') > -1) {
        const array = scene.split('&');
        array.forEach((item) => {
            sceneArray = item.split('=');
            query_[sceneArray[0]] = sceneArray[1];
        });
    } else {
        sceneArray = scene.split('=');
        query_[sceneArray[0]] = sceneArray[1];
    }
    return query_;
}
// https://segmentfault.com/a/1190000010371592
export function getDistance(lat1, lng1, lat2, lng2) {
    let radLat1 = lat1 * Math.PI / 180.0;
    let radLat2 = lat2 * Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

export function checkBeyondDistance(current, target, limitDistance) {
    let { latitude: lat1, longitude: lng1 } = current,
        { latitude: lat2, longitude: lng2 } = target,
        inRange = false;
    let distance = getDistance(lat1, lng1, lat2, lng2);
    inRange = Number(distance) <= Number(limitDistance);
    console.log(`实际距离${Number(distance)}km，限制距离${Number(limitDistance)}km`);
    if (!inRange) {
        throw new Error('地址超出门店所配送范围');
    }
    console.log(`门店范围校验通过`);
}

export function splitUserStatus(status) {
    const userStatus = {};
    Object.keys(USER_STATUS).forEach((key) => {
        const value = USER_STATUS[key];
        userStatus[key] = ((status & value) === value);
    });
    return userStatus;
}

export function autoNavigate(url, type = 'navigateTo') {
    wx.switchTab({
        url,
        fail() {
            wx[type]({ url });
        },
    });
}

export function autoNavigate_({ url, type = 'navigateTo' }) {
    return new Promise(async (resolve, reject) => {
        try {
            await wxProxy[type]({ url });
            resolve();
        } catch (e) {
            try {
                await wxProxy.switchTab({ url });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
    });
}

export async function go(e) {
    const { url, type } = e.currentTarget.dataset;
    autoNavigate_({ url, type });
}

export function autoTransformAddress(address = {}) {
    if (address.telNumber) {
        return {
            receiver_name: address.userName || '',
            receiver_phone: address.telNumber || '',
            receiver_country: address.nationalCode || '',
            receiver_state: address.provinceName || '',
            receiver_city: address.cityName || '',
            receiver_district: address.countyName || '',
            receiver_address: address.detailInfo || '',
            receiver_zipcode: address.postalCode || '',
        };
    } else if (address.receiver_phone) {
        return {
            userName: address.receiver_name || '',
            telNumber: address.receiver_phone || '',
            nationalCode: address.receiver_country || '',
            provinceName: address.receiver_state || '',
            cityName: address.receiver_city || '',
            countyName: address.receiver_district || '',
            detailInfo: address.receiver_address || '',
            postalCode: address.receiver_zipcode || ''
        };
    }
}

export async function subscribeMessage(keys = []) {
    const config = wx.getStorageSync(CONFIG);
    const subscribeMessageTemplates = config.subscribe_message_templates;

    if (!subscribeMessageTemplates) {
        return;
    }

    const tmplIds = subscribeMessageTemplates.filter((item) => {
        return keys.find((keysItem) => {
            return keysItem.key === item.key;
        });
    }).map((item) => {
        return item.template_id;
    });

    if (tmplIds.length === 0) {
        return;
    }

    console.log(tmplIds, 'tmplIds');
    try {
        const subRes = await wxProxy.requestSubscribeMessage({ tmplIds });
        // console.log(subRes);

        const isSubs = tmplIds.filter((item) => {
            return subRes[item] === 'accept';
        });

        // console.log(isSubs);

        const isSubscribeMessageTemplates = subscribeMessageTemplates.filter((item) => {
            return isSubs.indexOf(item.template_id) > -1;
        });

        // console.log(isSubscribeMessageTemplates);


        await api.hei.subscribe({
            templates: isSubscribeMessageTemplates
        });
    } catch (e) {
        console.log(e);
    }
}

// 米白店铺过期
export async function isExpired(e) {
    const { partner={} } = e;
    if (partner.is_expired) {
        wx.reLaunch({
            url: '/pages/webPages/webPages?isExpired=true'
        });
    }
}

/**
 * 转换微信默认地址字段名为接口格式-改自H5
 */
export function wxReceriverPairs(address = {}) {
    if (address.telNumber) {
        return {
            receiver_country: '',
            receiver_areacode: address.nationalCode || '', // 地区代码
            receiver_name: address.userName || '',
            receiver_phone: address.telNumber || '',
            receiver_state: address.provinceName || '', // 省
            receiver_city: address.cityName || '',
            receiver_district: address.countyName || '', // 区-小程序专属
            receiver_address: address.detailInfo || '', // 详细地址
            receiver_zipcode: address.postalCode || '' // 邮编
        };
    } else if (address.receiver_phone) {
        return {
            id: address.id || '', // 地址ID
            nationalCode: address.receiver_areacode || '', // 地区代码
            userName: address.receiver_name || '',
            telNumber: address.receiver_phone || '',
            provinceName: address.receiver_state || '', // 省
            cityName: address.receiver_city || '',
            countyName: address.receiver_district || '', // 区-小程序专属
            detailInfo: address.receiver_address || '', // 详细地址
            postalCode: address.receiver_zipcode || '' // 邮编
        };
    }
    return address;
}

export function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

export function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

export function joinUrl(url, params) {
    if (!isObject(params)) {
        return;
    }

    let paramsArray = [];

    const joinSymbol = url.indexOf('?') > 0 ? '&' : '?';

    Object.keys(params).forEach((key) => {
        params[key] && paramsArray.push(`${key}=${params[key]}`);
    });

    const paramsString = paramsArray.join('&');
    // console.log('paramsString',paramsString)
    if (paramsString) {
        return url + joinSymbol + paramsString;
    } else {
        return url;
    }
}

export function failToBindWeb(data) {
    if (data.errcode === 'bind_required') {
        wx.navigateTo({
            url: '/pages/bindWeb/bindWeb',
        });
    }
}

/* 16进制颜色转为RGB格式 */
export function colorRgb(string) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = string.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        // 处理六位的颜色值
        let sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2), 0));
        }
        return sColorChange.join(',');
    } else {
        return sColor;
    }
}
/* 函数防抖 */
export function debounce(fn, interval) {
    let timer = null;
    // 间隔时间，如果interval不传，则默认1000ms
    let gapTime = interval || 1000;
    return function(...args) {
        clearTimeout(timer);
        let context = this;
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, gapTime);
    };
}

/* 函数节流 */
export function throttle(fn, interval) {
    let enterTime = 0;// 触发的时间
    let gapTime = interval || 300;// 间隔时间，如果interval不传，则默认300ms
    return function(...args) {
        let context = this;
        let backTime = new Date();// 第一次函数return即触发的时间
        if (backTime - enterTime > gapTime) {
            fn.apply(context, args);
            enterTime = backTime;// 赋值给第一次触发的时间，这样就保存了第二次触发的时间
        }
    };
}

// 将微信地址转为回购预下单地址
export function transformAddressToCustomer(address = {}) {
    let newAddress = {
        customer_name: address.userName || '',
        customer_phone: address.telNumber || '',
        customer_country: address.nationalCode || '',
        customer_state: address.provinceName || '',
        customer_city: address.cityName || '',
        customer_district: address.countyName || '',
        customer_address: address.detailInfo || '',
        customer_zipcode: address.postalCode || '',
    };
    return newAddress;
}

