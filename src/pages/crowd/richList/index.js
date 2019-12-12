const app = getApp();

Component({
    properties: {
        richList: {
            type: Object,
            value: {},
        },
        themeColor: {
            type: Object,
            value: {},
        },
        self: {
            type: Boolean,
            value: true
        }
    },
    data: {
        globalData: app.globalData
    }
});
