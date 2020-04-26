import api from 'utils/api';
import { CONFIG } from 'constants/index';
import { go } from 'utils/util';
const app = getApp();

Page({
    data: {
        checked: false
    },

    go,

    onLoad() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            themeColor,
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
                await api.hei.bindWeb({
                    decrypted: true,
                    encrypted_data: encryptedData,
                    iv,
                });
                this.back();
            } catch (err) {
                console.log(err);
                wx.showModal({
                    title: '温馨提示',
                    content: err.errMsg,
                    showCancel: false
                });
            }
        }
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
