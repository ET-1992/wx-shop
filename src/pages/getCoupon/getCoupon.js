import api from 'utils/api';
import { showModal } from 'utils/wxp';
import { CONFIG } from 'constants/index';

Page({
    data: {

    },

    onLoad(params) {
        console.log('params', params);
        let { id } = params;
        this.getConfigData();
        this.setData({ id });
    },

    // 获取配置信息
    async getConfigData() {
        const config = wx.getStorageSync(CONFIG) || {};
        this.setData({ config });
    },

    async onGetCoupon() {
        await wx.showLoading({ title: '正在领取中' });
        let { id } = this.data;
        let msg = '';
        try {
            const data = await api.hei.postCouponGift({
                user_coupon_id: id
            });
            msg = '领取成功';
        } catch (e) {
            wx.hideLoading();
            let { code, errMsg } = e;
            // 依赖包跳转到登录绑定页面
            if (code === 'platform_user_id_required') {
                return;
            }
            msg = errMsg;
        }
        wx.hideLoading();
        const { confirm } = await showModal({
            title: '温馨提示',
            content: `${msg}，确定跳转到我的优惠券吗？`
        });
        if (confirm) {
            wx.redirectTo({
                url: '/pages/myCoupons/myCoupons',
            });
        }
    },
});