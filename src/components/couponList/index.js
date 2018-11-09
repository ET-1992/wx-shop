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
        }
    },
    data: {
        globalData: app.globalData
    }
});
