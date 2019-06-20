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
            { text: '储值账户', value: 'cash' },
            { text: '赠送账户', value: 'gift' }
        ],
        rechargeModal: false,
        next_cursor: 0,
        type: 'cash'
    },

    onLoad(params) {
        console.log(params);
    },

    async onShow() {
        this.setData({ isLoading: true });
        this.getConsumptionList();
        const { themeColor } = app.globalData;
        console.log('themeColor', themeColor);
        const config = wx.getStorageSync(CONFIG);
        const user = wx.getStorageSync('user');
        const recharge = await api.hei.rechargePrice();
        console.log(recharge, 'recharge');
        recharge.data[0].checked = true;
        console.log(recharge.data, 'recharge.data');
        this.setData({
            isLoading: false,
            themeColor,
            config,
            user,
            rechargeArray: recharge.data
        });
    },

    async getConsumptionList(e) {
        console.log('e', e); // 点击的哪个type
        const { next_cursor } = this.data;
        const { type } = this.data;
        const params = { cursor: next_cursor };
        if (type) {
            params.type = type;
        }
        console.log('type', type);
        const data = await api.hei.consumptionLog(params);
        const logs = data.data.logs;
        console.log('data.data.logs', logs);

        let consume = type === e ? this.data.ConsumptionList.concat(logs) : logs;
        console.log('consume', consume);

        for (let item in consume) {
            consume[item].formatTime = formatTime(new Date(consume[item].modified * 1000));
            consume[item].text = valueToText(CONSUM_TEXT, Number(consume[item].type));
        }
        console.log('consume', consume);
        this.setData({
            cash_balance: data.data.cash_balance,
            gift_balance: data.data.gift_balance,
            ConsumptionList: consume,
            next_cursor: data.next_cursor
        });
        console.log('ConsumptionList', this.data.ConsumptionList);
    },

    changeNavbarList(e) {
        const { index, value } = e.detail;
        console.log(index, 'e.detail');
        console.log(value, 'e.detail');
        this.setData({
            type: value,
            activeIndex: index
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
    }
});