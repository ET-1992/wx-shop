import { CONFIG } from 'constants/index';

Component({
    properties: {
        title: {
            type: String,
            value: 'delivery Component',
        },
        address: { // 确认订单数据
            type: Object,
            value: {},
        },
        homeDeliveryTimes: {
            type: Array,
            value: [],
            observer(newValue) {
                console.log('newValue15', newValue);
            }
        },
        homeDeliveryTime: {
            type: String,
            value: ''
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        },
        deliveryAddress: { // 订单详情数据
            type: Object,
            value: {},
        }
    },
    data: {
        index: 0
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        console.log(config.self_address, 'selfAddress');
        this.setData({
            selfAddress: config && config.self_address
        });
    },
    methods: {
        bindPickerChange(e) {
            console.log('picker发送选择改变，携带值为', e.detail.value);
            this.setData({
                index: e.detail.value
            });
        },
        onAddress() {
            this.triggerEvent('onAddress', {}, { bubbles: true });
        }
    }
});

