import { parseScene, autoNavigate } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import proxy from 'utils/wxProxy';
import api from 'utils/api';
import { CONFIG } from 'constants/index';

const app = getApp();
Page({
    data: {

    },

    async onShow() {
        // const config = wx.getStorageSync(CONFIG);
        const { config } = await api.hei.config();
        const webBarConfig = config.tabbar && config.tabbar.list && config.tabbar.list.find((item) => {
            return item.page_key === 'web';
        });

        if (webBarConfig) {
            const { url } = webBarConfig;
            this.setData({
                url
            });
        }
    },

    onShareAppMessage: onDefaultShareAppMessage
});
