
const app = getApp();

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
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
    },
});

