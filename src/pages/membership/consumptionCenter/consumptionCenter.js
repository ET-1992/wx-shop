import { CONFIG, CONSUM_TEXT } from 'constants/index';
import { formatTime, textToValue, valueToText } from 'utils/util';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        title: 'consumptionCenter',
        activeIndex: 0,
        isLoading: false,
        navbarListData: [
            { text: '储值账户', value: '2' },
            { text: '赠送账户', value: '3' }
        ],
        rechargeModal: false,
        next_cursor: 0,
        type: '2'
    },

    onLoad(params) {
        console.log(params);
    },

    async onShow() {
        this.setData({ isLoading: true });
        this.getConsumptionList();
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        const user = wx.getStorageSync('user');
        const recharge = await api.hei.rechargePrice();
        recharge.data[0].checked = true;
        this.setData({
            isLoading: false,
            themeColor,
            config,
            user,
            rechargeArray: recharge.data
        });
    },

    async getConsumptionList(e) {
        const { next_cursor } = this.data;
        const { type } = this.data;
        const params = { cursor: next_cursor };
        if (type) {
            params.currency = type;
        }
        const data = await api.hei.wallet(params);
        const logs = data.data.logs;

        let consume = type === e ? this.data.ConsumptionList.concat(logs) : logs;

        for (let item in consume) {
            consume[item].formatTime = formatTime(new Date(consume[item].modified * 1000));
            consume[item].text = valueToText(CONSUM_TEXT, Number(consume[item].type));
        }
        this.setData({
            cash_balance: data.data.cash_balance,
            gift_balance: data.data.gift_balance,
            ConsumptionList: consume,
            next_cursor: data.next_cursor
        });
    },

    changeNavbarList(e) {
        const { index, value } = e.detail;
        if (value === this.data.type) {
            return;
        }
        this.setData({
            type: value,
            activeIndex: index,
            next_cursor: 0
        });
        this.getConsumptionList();
    },

    /**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
    async onReachBottom() {
        const { next_cursor, type } = this.data;
        if (!next_cursor) {
            return;
        }
        this.getConsumptionList(type);
    },

    // 打开会员充值弹窗
    openRechargeModal() {
        this.setData({
            rechargeModal: true
        });
    },

    setConsumptionList() {
        this.onShow();
    }
});