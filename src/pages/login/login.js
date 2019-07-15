import api from 'utils/api';
import { CONFIG } from 'constants/index';
const app = getApp();

Page({
    data: {

    },

    onLoad() {
        const { themeColor } = app.globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            themeColor,
            config
        });
    },
    async getPhoneNumber(e) {
        console.log(e);
        const { encryptedData, iv } = e.detail;
        if (!encryptedData && !iv) {
            return;
        }
        try {
            await api.hei.bindWebUser({
                encrypted_data: encryptedData,
                iv,
            });
            const pages = getCurrentPages();
            console.log(pages);
            wx.navigateBack({
                delta: pages.length
            });
        } catch (e) {
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false
            });
        }
    }
});
