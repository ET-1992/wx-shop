// import api from 'utils/api';
import { go } from 'utils/util';
import { CONFIG, USER_KEY } from 'constants/index';

const app = getApp();
Page({
    data: {
        title: 'wallet',
        isLoading: true,
        currentUser: {},
        config: {},
        themeColor: {},
        extendList: [
            { name: '账户余额', icon: '/icons/me/wallet/wallet_account.svg', path: '/pages/accountDetail/accountDetail' },
            { name: '金币', icon: '/icons/me/wallet/wallet_coin.svg', path: '/pages/coinDetail/coinDetail' },
            { name: '优惠券', icon: '/icons/me/wallet/wallet_coupon.svg', path: '/pages/myCoupons/myCoupons' },
            { name: '礼品卡', icon: '/icons/me/wallet/wallet_gift.svg', path: '/pages/giftCardList/giftCardList' },
            { name: '电子卡券', icon: '/icons/me/wallet/wallet_e_card.svg', path: '/pages/eCardList/eCardList' },
        ],
    },

    onLoad(params) {
        console.log(params);
        const config = wx.getStorageSync(CONFIG);
        const user = wx.getStorageSync(USER_KEY);
        const { themeColor } = app.globalData;
        let { extendList } = this.data;
        if (!user.membership || !user.membership.is_member || !config.store_card_enable) {
            // 非会员或者储值卡关闭
            let index = extendList.findIndex(item => item.name === '账户余额');
            extendList.splice(index, 1);
        }
        if (config.coin_name) {
            // 重置金币名字
            let index = extendList.findIndex(item => item.name === '金币');
            extendList[index].name = config.coin_name;
        }
        this.setData({
            config,
            themeColor,
            currentUser: user,
            extendList,
        });
    },

    go,
});
