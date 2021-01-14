import api from 'utils/api';
import { go } from 'utils/util';
import proxy from 'utils/wxProxy';
const app = getApp();

Page({
    data: {
        checked: false
    },

    go,

    async onLoad() {
        const { themeColor } = app.globalData;
        const { isIphoneX } = app.systemInfo;
        const { config } = await api.hei.config();
        this.setData({
            themeColor,
            isIphoneX,
            config
        });
    },
    async getPhoneNumber(ev) {
        const { checked } = this.data;
        if (!checked) {
            wx.showToast({
                title: '请阅读并同意《用户服务协议》与《隐私政策》',
                icon: 'none'
            });
            return;
        }
        console.log(ev);
        const { encryptedData, iv } = ev.detail;
        if (encryptedData && iv) {
            try {
                const { exist_code, tips, phone, code } = await api.hei.checkUserExisted({
                    decrypted: true,
                    encrypted_data: encryptedData,
                    iv,
                });
                if (exist_code) {
                    const { confirm } = await proxy.showModal({
                        title: '温馨提示',
                        content: tips
                    });
                    if (confirm) {
                        this.submit({ phone, code });
                    }
                } else {
                    this.submit({ phone, code });
                }
            } catch (err) {
                console.log(err);
                wx.showModal({
                    title: '温馨提示',
                    content: err.errMsg,
                    showCancel: false
                });
            }
        } else {
            console.log('ev.detail', ev.detail);
            wx.showToast({ title: '获取手机号失败', icon: 'none' });
        }
    },
    async submit({ phone, code }) {
        await api.hei.bindWeb({
            phone,
            code
        });
        const { config } = this.data;
        const { afcode } = app.globalData;
        if (afcode) {
            api.hei.recordAffiliateBrowse({ code: afcode });
            if (!config.affiliate_bind_after_order) {
                api.hei.bindShare({ code: afcode });
            }
        }
        wx.showToast({ title: '设置成功', icon: 'success' });
        await new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
        this.back();
    },
    onChange(ev) {
        this.setData({
            checked: ev.detail
        });
    },
    back() {
        const pages = getCurrentPages();
        console.log(pages);
        wx.navigateBack({
            delta: pages.length
        });
    }
});
