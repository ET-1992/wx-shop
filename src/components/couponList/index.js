const app = getApp();
Component({
    properties: {
        coupon: {
            type: Object,
            value: {},
        },
        status: {
            type: String,
            value: '',
        },
        canChoice: {
            type: Boolean,
            value: false,
        },
        isSelected: {
            type: Boolean,
            value: false,
        },
        tplStyle: {
            type: String,
            value: 'default',
        },
        config: {
            type: Object,
            value: {},
        }
    },
    data: {
        globalData: app.globalData
    }
});
