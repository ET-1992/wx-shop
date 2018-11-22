import { getUserInfo, getAgainUserForInvalid, auth } from 'utils/util';
import { chooseAddress, showToast } from 'utils/wxp';
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
    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({
                user
            });
        },
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
        /* 我的管家 */
        async openManager() {
            const address  = wx.getStorageSync('address');
            if (!address) {
                const res = await auth({
                    scope: 'scope.address',
                    ctx: this
                });
                if (res) {
                    const addressRes = await chooseAddress();
                    wx.setStorageSync(ADDRESS_KEY, addressRes);
                }
            } else {
                this.setData({
                    openManager: true
                });
            }
        },
        redirectToShareCenter() {
            const user = getUserInfo();
            if (user) {
                wx.navigateTo({ url: '/pages/affiliate/affiliateCenter/affiliateCenter' });
            }
        },
        showToast() {
            showToast({
                title: '审核中',
                icon: 'none'
            });
        },
        /* 拨打售后电话 */
        call(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },
    }
});