Component({
    properties: {
        phone: {
            type: String,
            value: '',
        },
        customer: {
            type: Boolean,
            value: false
        },
        sessionFrom: {
            type: String,
            value: ''
        },
        config: {
            type: Object,
            value: {}
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