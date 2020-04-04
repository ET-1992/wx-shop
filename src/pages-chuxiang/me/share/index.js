import { getAgainUserForInvalid } from 'utils/util';
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
        /* 分享中心 */
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            if (user) {
                wx.navigateTo({
                    url: '/pages/affiliate/affiliateCenter/affiliateCenter'
                });
            }
        },
    }
});
