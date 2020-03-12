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
        userCoupon: {
            type: Object,
            value: {},
            observer(newVal) {
                console.log('newVal35', newVal);
                if (!newVal) { return }
                this.setData({
                    'content.coupons': newVal
                });
            }
        },
    },

    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            if (iv && encryptedData) {
                await getAgainUserForInvalid({ encryptedData, iv });
                this.onCouponsClick(e);
            } else {
                wx.showModal({
                    title: '温馨提示',
                    content: '需授权后操作',
                    showCancel: false,
                });
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