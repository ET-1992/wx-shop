import api from 'utils/api';
import { LOGISTICS_STATUS_TEXT } from 'constants/index';
import { valueToText } from 'utils/util';
const app = getApp();

// 创建页面实例对象
Page({
    // 页面的初始数据
    data: {
        logistics: {
            company: '--',
            no: '--',
            list: [],
            status: '',
        },
        order: {},
        isLoading: true
    },

    async onShow({ orderNo, logisticsIndex = 0, logisticId = '' }) {

        const { order } = await api.hei.fetchOrder({ order_no: orderNo });

        const { logistics } = await api.hei.fetchLogistic({
            order_no: orderNo,
            logistic_id: logisticId
        });

        const updateData = { order };

        if (logistics) {
            logistics.list = logistics.list || [];

            logistics.logisticsText = valueToText(LOGISTICS_STATUS_TEXT, logistics.status);

            logistics.list = logistics.list.reduce((list, item) => {
                const [date, time] = item.datetime.split(' ');
                item.date = date.substr(5);
                item.time = time.substr(0, 5);
                list.unshift(item);
                return list;
            }, []);

            updateData.logistics = logistics;
        }

        updateData.isLoading = false;

        this.setData(updateData);

        console.log(this.data);
    },
    setClipboard() {
        console.log(this.data.logistics.no);
        wx.setClipboardData({
            data: this.data.logistics.no,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功！',
                            icon: 'success',
                            duration: 2400
                        });
                    }
                });
            }
        });
    },
});
