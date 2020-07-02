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
            let failContent = {
                '-3002': '获取插件配置信息失败',
                '-3004': '用户信息授权失败',
                '-3005': '客服消息发送失败',
                '-3006': '发送的客服人员已经和当前用户是好友关系',
                '-3008': '当前配置没有客服人员',
            };
            let { errcode, name = '', headurl = '' } = e.detail;
            let showSuccess = false,
                showFail = false,
                hasFrend = false,
                failTip = '',
                serviceName = '',
                serviceHeadurl = '';
            wx.hideLoading();
            console.log('errcode', errcode);
            if (errcode === 0) {
                showSuccess = true;
                serviceName = name;
                serviceHeadurl = headurl;
            } else if (errcode === -3006) {
                showSuccess = true;
                hasFrend = true;
                serviceName = name;
                serviceHeadurl = headurl;
            } else {
                showFail = true;
                failTip = failContent[errcode] || '';
            }
            this.setData({
                showSuccess,
                showFail,
                failTip,
                hasFrend,
                serviceName,
                serviceHeadurl,
            });
        },
    }
});

