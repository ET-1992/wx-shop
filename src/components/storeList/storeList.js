
Component({
    properties: {
        title: {
            type: String,
            value: 'storeList Component',
        },
        addresses: {
            type: Object,
            value: {},
            observer(newValue) {
                console.log('newValue12', newValue);
            }
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        },
        homeDeliveryTimes: {
            type: Array,
            value: [],
            observer(newValue) {
                console.log('newValue15', newValue);
            }
        },
        address: { // 确认订单数据 或者 收货地址
            type: Object,
            value: {},
        }
    },

    data: {
        index: 0
    },

    methods: {
        bindPickerChange(e) {
            console.log('picker发送选择改变，携带值为', e.detail.value);
            this.setData({
                index: e.detail.value
            });
        },

        toLiftListPage() {
            const { address } = this.data;
            if (address.userName) {
                wx.navigateTo({
                    url: '/pages/liftList/liftList?type=4'
                });
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '请先填写收件地址',
                    showCancel: false,
                });
            }
        }
    }
});

