Component({
    properties: {
        showModal: {
            type: Boolean,
            value: false
        },
        manager: {
            type: Object,
            value: {}
        },
        themeColor: {
            type: Object,
            value: {}
        }
    },
    methods: {
        callManager(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },
        closeModal() {
            this.setData({
                showModal: false
            });
        }
    }
});

