import api from 'utils/api';
import { go } from 'utils/util';
import { showModal } from 'utils/wxp';
import { CONFIG } from 'constants/index';
import { wxPay, onDefaultShareAppMessage } from 'utils/pageShare';

Page({
    data: {
        title: 'cardCollection',
        isLoading: true,
        coinName: '金彩卡',
        activeTab: 'exchange',  // 标签页选中项
        rechargeEnable: true,  // 购买金币卡开关
        rechargeList: [],  // 购买金币卡列表
        cardList: [],  // 卡包列表
        itemChecked: '',  // 购买金币卡选中项
        itemCheckedCoin: '',  // 购买金币卡选中项金币数量
        itemCheckedPrice: '0',  // 购买金币卡选中项价格
        exchangeForm: {
            account: '',
            password: '',
        },  // 兑换金币卡表单
    },

    go,

    onLoad(params) {
        console.log(params);
        let { tab = 'exchange' } = params;
        const { themeColor } = getApp().globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            themeColor,
            config,
            activeTab: tab,
            coinName: (config.coin_name || '金彩') + '卡'
        });
        this.getCardData();
    },

    // 获取卡包数据
    async getCardData() {
        this.setData({ isLoading: true });
        const data = await api.hei.getCoinCard({});
        let { purchase_enable, card_setting, card_list, current_user } = data;
        this.setData({
            isLoading: false,
            rechargeEnable: purchase_enable,
            rechargeList: card_setting,
            cardList: card_list,
            current_user,
        });
    },

    // 切换标签
    onTabsChange(e) {
        let name = e.detail.name;
        this.setData({ activeTab: name });
    },

    // 选择购买金币卡
    onRechargeChange(e) {
        let { code, price, coin } = e.currentTarget.dataset;
        this.setData({
            itemChecked: code,
            itemCheckedCoin: coin,
            itemCheckedPrice: price,
        });
    },

    // 确定购买金币卡
    async onPayment() {
        let { itemChecked, itemCheckedCoin, coinName } = this.data;
        if (!itemChecked) {
            wx.showModal({
                title: '温馨提示',
                content: `请选择正确的${coinName}面值`,
                showCancel: false,
            });
            return;
        }
        const { cancel } = await showModal({
            title: '温馨提示',
            content: `您确定购买${itemCheckedCoin}面值的${coinName}吗？`,
        });
        if (cancel) { return }
        try {
            const data = await api.hei.postCoinCard({
                card_code: itemChecked,
                pay_method: 'WEIXIN',
            });
            let { pay_sign } = data;
            if (pay_sign) {
                await wxPay(pay_sign);
                this.getCardData();
                this.setData({ activeTab: 'card' });
            }
        } catch (e) {
            console.log('e.errMsg', e.errMsg);
        }
    },

    // 金币卡兑换输入
    bindKeyInput(e) {
        let name = e.currentTarget.dataset.name;
        let value = e.detail.value;
        this.setData({
            [`exchangeForm.${name}`]: value,
        });
    },

    // 金币卡兑换验证
    onValidate() {
        let { account, password } = this.data.exchangeForm;
        let formValidateFail = true,
            err = '';
        if (password && account) {
            formValidateFail = false;
        } else {
            password || (err = '请输入卡密');
            account || (err = '请输入卡号');
            wx.showToast({
                title: err,
                icon: 'none',
            });
        }
        this.setData({ formValidateFail });
    },

    // 金币卡兑换确定
    async onSubimit() {
        await this.onValidate();
        let { exchangeForm: { account, password }, formValidateFail, coinName } = this.data;
        if (formValidateFail) return;
        const { confirm } = await showModal({
            title: '温馨提示',
            content: `你确定要兑换该${coinName}吗？`
        });
        if (!confirm) return;
        const PHYSICALCARD = 2;
        try {
            await api.hei.postExchangeCoinCard({
                card_no: account,
                card_password: password,
                type: PHYSICALCARD,
            });
            this.setData({ exchangeForm: {}});
            await showModal({
                title: '温馨提示',
                content: '兑换成功',
                showCancel: false,
            });
            this.getCardData();
            this.setData({ activeTab: 'card' });
        } catch (e) {
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false,
            });
        }
    },

    // 扫码输入
    onScanCode() {
        let that = this;
        wx.scanCode({
            success(res) {
                let { card_no, card_password } = JSON.parse(res.result);
                if (!card_no || !card_password) {
                    wx.showModal({
                        title: '温馨提示',
                        content: '获取内容失败',
                        showCancel: false,
                    });
                    return;
                }
                that.setData({
                    'exchangeForm.account': card_no,
                    'exchangeForm.password': card_password,
                });
            },
            fail() {
                console.log('扫码失败');
            },
        });
    },

    // 虚拟卡充值
    async onRecharge(e) {
        let { coinName, cardList } = this.data;
        const VIRTUAL_CARD = 1;
        let { no, index } = e.currentTarget.dataset;
        const { cancel } = await showModal({
            title: '温馨提示',
            content: `你确定要充值该${coinName}吗？`
        });
        if (cancel) { return }
        try {
            await api.hei.postExchangeCoinCard({
                card_no: no,
                type: VIRTUAL_CARD,
            });
            await showModal({
                title: '温馨提示',
                content: '充值成功',
                showCancel: false,
            });
            cardList.splice(index, 1);
            this.setData({ cardList }, () => {
                wx.navigateTo({ url: '/pages/coinDetail/coinDetail' });
            });
        } catch (e) {
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false,
            });
        }
    },

    // 下拉刷新
    onPullDownRefresh() {
        this.getCardData();
        wx.stopPullDownRefresh();
    },

    // 页面分享设置
    onShareAppMessage(e) {
        let { current_user, config } = this.data;
        let id = e.target.dataset.id || 0;  // 优惠券id
        let nickname = current_user.nickname || '用户';

        this.setData({
            share_title: `好友${nickname}给你赠送了一张充值卡，快去领取吧`,
            share_image: `${config.coin_card.share_image}`,
        });
        let opts = { id };
        let path =  `pages-cuilv/getCoinCard/getCoinCard`;
        return onDefaultShareAppMessage.call(this, opts, path);
    },
});
