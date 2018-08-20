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
        }
    },
    methods: {
        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        }
    }
});