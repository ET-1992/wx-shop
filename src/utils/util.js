import { TOKEN_KEY, EXPIRED_KEY, USER_KEY } from 'constants/index';
import api from 'utils/api';
import { login, checkSession, getSetting, authorize } from 'utils/wxp';
import { BANK_CARD_LIST } from 'utils/bank';

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
                resolve(user);
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

export function checkPhone(value) {
    const reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    return reg.test(value);
}

export function getNodeInfo(id, obj = {}) {
    return new Promise((resolve, reject) => {
        const defaultObj = {
            dataset: true,
            size: true,
            scrollOffset: true,
            rect: true,
            ...obj
        };
        const query = wx.createSelectorQuery();
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

export function imgToHttps(url = '') {
    const httpsHost = 'https://cdn.97866.com';
    const httpHost = 'http://cdn2.wpweixin.com';
    return url.replace(httpHost, httpsHost);
}

/* 银行 */
export function bankCardAttribution(bankCard) {
    let cardTypeMap = { DC: '储蓄卡', CC: '信用卡', SCC: '准贷记卡', PC: '预付费卡' };
    function extend(target, source) {
        let result = {};
        let key;
        for (key in target) {
            if (target.hasOwnProperty(key)) {
                result[key] = target[key];
            }
        }
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = source[key];
            }
        }
        return result;
    }
    function getCardTypeName(cardType) {
        if (cardTypeMap[cardType]) {
            return cardTypeMap[cardType];
        }
        return 'error';
    }

    function _getBankInfoByCardNo(cardNo) {
        for (let i = 0, len = BANK_CARD_LIST.length; i < len; i++) {
            let bankcard = BANK_CARD_LIST[i];
            let patterns = bankcard.patterns;
            for (let j = 0, jLen = patterns.length; j < jLen; j++) {
                let pattern = patterns[j];
                if ((new RegExp(pattern.reg)).test(cardNo)) {
                    let info = extend(bankcard, pattern);
                    delete info.patterns;
                    delete info.reg;
                    info['cardTypeName'] = getCardTypeName(info['cardType']);
                    return info;
                }
            }
        }
        return 0;
    }
    return _getBankInfoByCardNo(bankCard);
}

export function updateCart(e) {
    const CART_NUM  = wx.getStorageSync('CART_NUM');
    if (!CART_NUM || CART_NUM === '0') {
        wx.removeTabBarBadge({
            index: e
        });
    } else {
        wx.setTabBarBadge({
            index: e,
            text: CART_NUM
        });
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