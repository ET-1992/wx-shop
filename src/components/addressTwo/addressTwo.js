import { CONFIG } from 'constants/index';

Component({
    properties: {
        title: {
            type: String,
            value: 'addressTwo Component',
        },
        address: {
            type: Object,
            value: {},
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        }
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        console.log(config.self_address, 'selfAddress');
        this.setData({
            selfAddress: config && config.self_address
        });
    }
});

