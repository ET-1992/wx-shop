import { getUserInfo, getAgainUserForInvalid, auth, go } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY } from 'constants/index';

Component({
    properties: {
        infosComponentData: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ...newValue
                });
            }
        }
    },
    data: {
        show: false
    },
    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({
                user
            });
        },

        /* 地址管理 */
        async onAddress() {
            const res = await auth({
                scope: 'scope.address',
                ctx: this
            });
            if (res) {
                const addressRes = await chooseAddress();
                wx.setStorageSync(ADDRESS_KEY, addressRes);
            }
        },

        /* 分享中心 */
        redirectToShareCenter() {
            const user = getUserInfo();
            if (user) {
                wx.navigateTo({ url: '/pages/affiliate/affiliateCenter/affiliateCenter' });
            }
        },

        /* 分享店铺 */
        /* 调起底部弹窗 */
        async openShareModal() {
            let { show } = this.data;
            this.setData({
                show: !show
            });
        },

        /* 关闭底部弹窗 */
        onClose() {
            let { show } = this.data;
            this.setData({
                show: !show
            });
        },

        /* 关闭底部弹窗 */
        closeShareModal() {
            let { show } = this.data;
            this.setData({
                show: !show
            });
        },

        /* 拨打售后电话 */
        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },

        go

        /* 我的管家 */
        // async openManager() {
        //     const address  = wx.getStorageSync('address');
        //     if (!address) {
        //         const res = await auth({
        //             scope: 'scope.address',
        //             ctx: this
        //         });
        //         if (res) {
        //             const addressRes = await chooseAddress();
        //             wx.setStorageSync(ADDRESS_KEY, addressRes);
        //         }
        //     } else {
        //         this.setData({
        //             openManager: true
        //         });
        //     }
        // }
        // }
    },
});