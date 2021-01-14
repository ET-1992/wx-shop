import { getAgainUserForInvalid, autoNavigate_ } from 'utils/util';

Component({
    properties: {
        infosComponentData: {
            type: Object,
            value: {},
        },
    },
    observers: {
        'infosComponentData': function(value) {
            if (!value) { return }
            let { config, user, affiliate, extend_icons } = value;
            this.setData({
                config,
                user,
                affiliate,
                extend_icons,
            });
        }
    },
    methods: {
        // 获取授权信息
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            if (iv && encryptedData) {
                const user = await getAgainUserForInvalid({ encryptedData, iv });
                this.setData({ user });
            } else {
                throw new Error('需授权后操作');
            }
        },

        // 授权直链
        async onAuthNavigated(e) {
            try {
                await this.bindGetUserInfo(e);
                let { key } = e.currentTarget.dataset,
                    { user, affiliate } = this.data;
                if (!user) { return }
                // 分享中心处于审核中
                if (key === 'share_center' && affiliate && affiliate.member && affiliate.member.audit_status === '1') {
                    throw new Error('当前用户处于审核状态');
                }
                this.onNavigated(e);
            } catch (e) {
                wx.showModal({
                    title: '温馨提示',
                    content: e.message || '运行出错了',
                    showCancel: false,
                });
            }
        },

        // 普通直链
        async onNavigated(e) {
            let { path } = e.currentTarget.dataset,
                err = '';
            try {
                await autoNavigate_({ url: path });
            } catch (e) {
                err = `跳转失败${path}`;
            }
            if (!err) { return }
            wx.showModal({
                title: '报错提示',
                content: err,
                showCancel: false,
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