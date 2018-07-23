import api from 'utils/api';
import { getNodeInfo, formatTime } from 'utils/util';

Page({
    data: {
        isLoading: true
    },

    onLoad(parmas) {
        console.log(parmas);
        wx.setNavigationBarTitle({
            title: '订单列表'
        });
    },

    async onShow() {
        const data = await api.hei.getShareOrderList();
        const { orders } = data;
        // orders.forEach((item) => {
        //     item.formatTime = formatTime(new Date(Number(item.modified)) * 1000);
        // });

        this.setData({
            orders,
            isLoading: false
        });
        console.log(this.data);
    }
});
