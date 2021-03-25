const app = getApp();
Component({
    properties: {
        config: {
            type: Object,
            value: {}
        },
        options: {
            type: Array,
            value: []
        }
    },
    methods: {
        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },
        // 展示企业微信联系方式
        onCustomService() {
            let customServiceModal = true;
            this.setData({
                customServiceModal,
            });
        },
    }
});