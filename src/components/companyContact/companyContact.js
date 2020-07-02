Component({
    properties: {
        // 插件客服ID
        plugid: {
            type: String,
            value: '',
        },
        // 弹窗开关
        show: {
            type: Boolean,
            value: false,
        }
    },
    methods: {
        onClose() {
            let show = false;
            this.setData({
                show,
            });
        },

        // 点击客服
        startmessage() {
            wx.showLoading();
        },

        // 完成客服请求
        completemessage(e) {
            let { errcode, name = '', headurl = '' } = e.detail;
            let showSuccess = false,
                showFail = false,
                hasFrend = false,
                serviceName = '',
                serviceHeadurl = '';
            wx.hideLoading();
            if (errcode === 0) {
                showSuccess = true;
                serviceName = name;
                serviceHeadurl = headurl;
            } else if (errcode === 3006) {
                showSuccess = true;
                hasFrend = true;
                serviceName = name;
                serviceHeadurl = headurl;
            } else {
                showFail = true;
            }
            this.setData({
                showSuccess,
                showFail,
                hasFrend,
                serviceName,
                serviceHeadurl,
            });
        },
    }
});

