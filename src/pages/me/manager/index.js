Component({
    properties: {
        showModal: {
            type: Boolean,
            value: false
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

