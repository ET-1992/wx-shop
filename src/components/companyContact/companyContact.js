Component({
    properties: {
        plugid: {
            type: String,
            value: '',
        },
        show: {
            type: Boolean,
            value: false,
        }
    },
    // data: {
    //     showSuccess: {
    //         type: Boolean,
    //         value: false,
    //     }
    // },
    methods: {
        onClose() {
            let show = false;
            this.setData({
                show,
            });
        },
        startmessage() {
            wx.showLoading();
        },
        completemessage(e) {
            let { errcode, name = '', headurl = '' } = e.detail;
            wx.hideLoading();
            if (errcode === 0) {
                this.setData({
                    showSuccess: true,
                    name,
                    headurl,
                });
            } else if (errcode === 3006) {
                this.setData({
                    showSuccess: true,
                    name,
                    headurl,
                    hasFrend: true,
                });
            } else {
                this.setData({
                    showFail: true,
                });
            }
        },
    }
});

