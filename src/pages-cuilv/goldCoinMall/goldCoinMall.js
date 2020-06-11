import { go, getAgainUserForInvalid } from 'utils/util';
import api from 'utils/api';
import { CONFIG, USER_KEY } from 'constants/index';

Page({
    data: {
        title: 'goldCoinMall',
        isLoading: true,
        current_user: {},
        coinData: {},  // 金币兑换数据
        cloudData: {},  // 云购数据
        config: {},
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = getApp().globalData;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ themeColor, config });
        wx.setNavigationBarTitle({
            title: `${(config.coin_name || '金彩')}商城`
        });
        this.getMallData();
    },

    go,

    // 获取商城数据
    async getMallData() {
        this.setData({ isLoading: true });
        const data = await api.hei.getCoinMallHome();
        let { current_user, coin_module, cloud_module } = data;
        if (Object.keys(current_user).length === 0) {
            current_user = wx.getStorageSync(USER_KEY);
        }
        this.setData({
            current_user,
            coinData: coin_module,
            cloudData: cloud_module,
            isLoading: false,
        });
    },

    // 加入心愿单
    async addCloudCart(e) {
        console.log('e', e);
        let { postId: post_id, blogId: source_blog_id } = e.currentTarget.dataset;
        try {
            await api.hei.addCart({ post_id, source_blog_id });
            wx.hideToast();
            wx.showToast({
                title: '成功添加',
                icon: 'success',
            });
        } catch (error) {
            console.log('error', error);
        }
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const current_user = await getAgainUserForInvalid({ encryptedData, iv });
        this.setData({ current_user });
    },

    // 监听下拉刷新
    onPullDownRefresh() {
        this.getMallData();
        wx.stopPullDownRefresh();
    },
});

