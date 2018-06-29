import api from 'utils/api';

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
    },

    async onLoad({ orderNo }) {
        // 		const logistics = {
        //     "company": "EMS", /* 快递公司名字 */
        //     "com": "ems",
        //     "no": "1186465887499", /* 快递单号 */
        //     "status": "1", /* 1表示此快递单的物流信息不会发生变化，此时您可缓存下来；0表示有变化的可能性 */
        //     "list": [
        //       {
        //         "datetime": "2016-06-15 21:44:04",  /* 物流事件发生的时间 */
        //         "remark": "离开郴州市 发往长沙市【郴州市】", /* 物流事件的描述 */
        //         "zone": "" /* 快件当时所在区域，由于快递公司升级，现大多数快递不提供此信息 */
        //       },
        //       {
        //         "datetime": "2016-06-15 21:46:45",
        //         "remark": "郴州市邮政速递物流公司国际快件监管中心已收件（揽投员姓名：侯云,联系电话:）【郴州市】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-16 12:04:00",
        //         "remark": "离开长沙市 发往贵阳市（经转）【长沙市】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-17 07:53:00",
        //         "remark": "到达贵阳市处理中心（经转）【贵阳市】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-18 07:40:00",
        //         "remark": "离开贵阳市 发往毕节地区（经转）【贵阳市】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-18 09:59:00",
        //         "remark": "离开贵阳市 发往下一城市（经转）【贵阳市】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-18 12:01:00",
        //         "remark": "到达  纳雍县 处理中心【毕节地区】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-18 17:34:00",
        //         "remark": "离开纳雍县 发往纳雍县阳长邮政支局【毕节地区】",
        //         "zone": ""
        //       },
        //       {
        //         "datetime": "2016-06-20 17:55:00",
        //         "remark": "投递并签收，签收人：单位收发章 *【毕节地区】",
        //         "zone": ""
        //       }
        //     ]
        // }

        const { order } = await api.hei.fetchOrder({ order_no: orderNo });
        order.productCount = order.items.reduce((count, item) => {
            return count + Number(item.quantity);
        }, 0);

        const { logistics } = await api.hei.fetchLogistics({
            order_no: orderNo
        });

        const updateData = { order };

        if (logistics) {
            logistics.list = logistics.list || [];

            logistics.list = logistics.list.reduce((list, item) => {
                const [date, time] = item.datetime.split(' ');
                item.date = date.substr(5);
                item.time = time.substr(0, 5);
                list.unshift(item);
                return list;
            }, []);

            updateData.logistics = logistics;
        }

        this.setData(updateData);

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
