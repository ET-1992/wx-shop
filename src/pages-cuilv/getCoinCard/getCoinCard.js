import api from 'utils/api';
import { showModal } from 'utils/wxp';
import { go, getAgainUserForInvalid } from 'utils/util';
import { CONFIG } from 'constants/index';

Page({
    data: {
        title: 'getCoinCard',
        isLoading: true,
        config: {},
        sender: {},  // 赠送人
        card: {},  // 赠送卡
        hasRecived: false,  // 是否已领取
    },

    onLoad(params) {
        console.log(params);
        let { id } = params;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ id, config });
        this.initPage();
        this.getCardData();
    },

    go,

    initPage() {
        const { themeColor } = getApp().globalData;
        this.setData({ themeColor });
    },

    // 获取金币卡
    async getCardData() {
        let { id } = this.data;
        const data = await api.hei.getCoinCardShareDetail({
            user_card_id: id,
        });
        let { sender, user_card } = data;
        this.setData({
            sender,
            card: user_card,
            isLoading: false,
        });
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        this.setData({ user });
    },

    // 领取金币卡
    async receiveCard() {
        const { confirm } = await showModal({
            title: '温馨提示',
            content: '确定领取该充值卡吗',
        });
        if (!confirm) return;
        let { id } = this.data;
        try {
            await api.hei.getCoinCardShareReceive({
                user_card_id: id,
            });
            this.setData({ hasRecived: true });
        } catch (error) {
            await showModal({
                title: '温馨提示',
                content: error.errMsg,
                showCancel: false,
            });
        }

    },
});
