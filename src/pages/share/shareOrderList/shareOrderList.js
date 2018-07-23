import api from 'utils/api';
import { getNodeInfo, formatTime } from 'utils/util';

Page({
    data: {
        title: 'shareOrderList',
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    async onShow() {
        const data = await api.hei.getShareOrderList();
        console.log(data);
        const { orders } = data;
        orders.forEach((item) => {
            item.formatTime = formatTime(new Date(Number(item.modified)) * 1000);
        });

        this.setData({
            orders
        });
    }
});
