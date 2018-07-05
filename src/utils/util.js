import { TOKEN_KEY, EXPIRED_KEY, USER_KEY } from 'constants/index';
import api from 'utils/api';
import { login, checkSession } from 'utils/wxp';
import { bankcardList } from 'utils/bank';

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

    return [year, month, day]
        .map(formatNumber)
        .join('-') + ' ' +
			[hour, minute, second].map(formatNumber).join(':');
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
    const reg = /^((1[3-8][0-9])+\d{8})$/;
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

/* 银行 */
export function bankCardAttribution(bankCard) {
    let cardTypeMap = {
        DC: '储蓄卡',
        CC: '信用卡',
        SCC: '准贷记卡',
        PC: '预付费卡'
    };
    function extend(target, source) {
        let result = {};
        let key;
        // target = target || {};
        // source = source || {};
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
        for (let i = 0, len = bankcardList.length; i < len; i++) {
            let bankcard = bankcardList[i];
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
        return 'error';
    }
    return _getBankInfoByCardNo(bankCard);
}