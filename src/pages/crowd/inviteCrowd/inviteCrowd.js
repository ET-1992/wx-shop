import api from 'utils/api';
import { onDefaultShareAppMessage } from 'utils/pageShare';
const app = getApp();

Page({
    data: {
        maxlength: 50,  // 输入框最大字数
    },

    async onLoad(options) {
        console.log(options);
        const { globalData: { themeColor }, systemInfo: { isIphoneX }} = app;
        wx.setNavigationBarTitle({
            title: '请朋友代付'
        });
        this.setData({
            themeColor,
            isIphoneX,
            order_no: options.id,
            crowd_pay_no: options.crowd_pay_no
        });
        await this.loadOrder(options.id);
    },
    async loadOrder(id) {
        const { order } = await api.hei.fetchOrder({ order_no: id });

        // -----------------处理价格显示
        let info = {};
        info.finalPay = Number(order.amount); // 付款价格
        info.finalPayDispaly = Number(info.finalPay).toFixed(2);
        // -----------------End

        this.setData({
            items: order.items,
            finalPayDispaly: info.finalPayDispaly
        });
    },
    bindTextAreaBlur(e) {
        let content = e.detail.value;
        let len = parseInt(content.length, 0);
        this.setData({
            content: content || '就差一点点了，快来助我一臂之力吧',
            len: len
        });
    },
    onShareAppMessage() {
        let { content, order_no, crowd_pay_no } = this.data;
        let shareMsg = {
            title: content,
            path: `/pages/crowd/crowdProgress/crowdProgress?id=${order_no}&crowd_pay_no=${crowd_pay_no}`,
            imageUrl: ''
        };
        return shareMsg;
    },
});
