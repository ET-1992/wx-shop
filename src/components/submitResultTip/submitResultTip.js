import { go } from 'utils/util';
Component({
    properties: {
        title: {
            type: String,
            value: '',
        },
        subTitle: {
            type: String,
            value: '',
        },
        navigateUrl: {
            type: String,
            value: '',
        },
        orderNo: {
            type: String,
            value: '',
        },
    },
    methods: {
        go,

        // 返回上一步
        onBack() {
            wx.navigateBack({
                delta: 1
            });
        }
    }
});

