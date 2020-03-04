import api from 'utils/api';
import { showToast } from 'utils/wxp';
import { getAgainUserForInvalid } from 'utils/util';

Component({
    properties: {
        coupon: {
            type: Object,
            value: {},
            observer(newVal) {
                console.log('newVal10', newVal);
                if (!newVal) { return }
                const { content, setting, title, type, id } = newVal;
                this.setData({
                    content,
                    setting,
                    title,
                    type,
                    id
                });
            }
        },
        config: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
    },

    methods: {
        async bindGetUserInfo(e) {
            console.log('2\e', e);
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({ user });
            if (user) {
                this.onCouponsClick(e);
            } else {
                console.log('用户未授权,无法领取优惠券');
            }
        },

        async onCouponsClick(ev) {
            console.log('ev221', ev);
            const { id, index, status, title } = ev.currentTarget.dataset;
            if (Number(status) === 2) {
                await this.onReceiveCoupon(id, index);
            } else if (Number(status) === 4) {
                wx.navigateTo({
                    url: `/pages/couponProducts/couponProducts?couponId=${id}&couponTitle=${title}`,
                });
            } else { return }
        },

        async onReceiveCoupon(id, index) {
            const { coupons } = this.data.content;
            if (!coupons[index].stock_qty) {
                return;
            }

            api.hei.receiveCoupon({
                coupon_id: id,
            });

            showToast({ title: '领取成功' });

            coupons[index].status = 4;
            console.log(coupons);
            this.setData({
                'content.coupons': coupons
            });
        },
    },
});