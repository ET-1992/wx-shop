import { CONFIG } from 'constants/index';
import { wxPay, onDefaultShareAppMessage } from 'utils/pageShare';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        title: 'exchangeCard',
        themeColor: {},
        config: {},
        activeIndex: 0,
        next_cursor: 0,
        tabList: [
            {
                idx: 0,
                title: '卡密兑换',
            },
            {
                idx: 1,
                title: '手机验证',
            }
        ],
        cardNumber: '',
        password: '',
        phone: '',
        sms: '',
        cardList: [
            {
                amount: '1000',
                time: 1606381852,
                no: '123456982794823748264',
                status: 1
            },
            {
                amount: '9000',
                time: 1606381852,
                no: '123456945785688748264',
                status: 1
            },
            {
                amount: '1000',
                time: 1606381852,
                no: '123456982794823748264',
                status: 2,
                user_name: '二米'
            },
            {
                amount: '400',
                time: 1606040217,
                no: '1234569823624473346264',
                status: 1
            },
            {
                amount: '900',
                time: 1606381852,
                no: '123456982794823748264',
                status: 2,
                user_name: '四米'
            },
            {
                amount: '100',
                time: 1606040217,
                no: '12345698263462668826',
                status: 2,
                user_name: '五米'
            },
            {
                amount: '1000',
                time: 1606381860,
                no: '12345698263462668826',
                status: 2,
                user_name: '三米'
            },
            {
                amount: '200',
                time: 1606040217,
                no: '12345698263462668826',
                status: 3,
            },
            {
                amount: '500',
                time: 1606281460,
                no: '12345698263462668726',
                status: 3,
            },
        ],
        availableList: [],
        unavailableList: []
    },

    onLoad(params) {
        console.log(params);

        const { cardList } = this.data;
        let availableList = cardList.filter(item => {
            return item.status === 1;
        });
        let unavailableList = cardList.filter(item => {
            return (item.status === 2 || item.status === 3);
        });

        if (cardList && cardList.length) {
            wx.setNavigationBarTitle({
                title: '我的兑换券'
            });
        }

        this.setData({
            availableList,
            unavailableList
        });
    },

    async onShow() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ themeColor, config });
    },

    // 改变导航标签
    changeNavbarList(e) {
        const { index } = e.detail;
        this.setData({
            activeIndex: index
        });
    },

    // 密码登录
    onSubmitPassword() {
        const { cardNumber, password } = this.data;
    },

    // 验证码登录
    onSubmitSms() {
        const { phone, sms } = this.data;
    },

    // 充值
    async onRecharge(amount) {
        console.log('amount', amount);
        try {
            // const { pay_sign } = await api.hei.xxx({
            //     amount,
            //     pay_method: 'WEIXIN',
            // });
            // if (pay_sign) {
            //     await wxPay(pay_sign);
            // }
        } catch (e) {
            console.log('e.errMsg', e.errMsg);
        }
    },

    onChangeCardNumber(event) {
        const { value } = event.detail;
        this.setData({ cardNumber: value });
    },
    onChangePassword(event) {
        const { value } = event.detail;
        this.setData({ password: value });
    },
    onChangePhone(event) {
        const { value } = event.detail;
        this.setData({ phone: value });
    },
    onChangeSms(event) {
        const { value } = event.detail;
        this.setData({ sms: value });
    }
});
