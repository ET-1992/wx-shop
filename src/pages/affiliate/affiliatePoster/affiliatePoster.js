import { onDefaultShareAppMessage } from 'utils/pageShare';
import { CONFIG, USER_KEY } from 'constants/index';
import { imgToHttps } from 'utils/util';

const app = getApp();

Page({
    data: {
        isLoading: true,
        options: {},
        share_title: '',
        share_image: '',
        qrcodePaths: [
            {
                type: '2',
                postertype: 'shareShop',
                path: 'pages/home/home',
                title: '我发现了一家好店，快来看看！'
            },
            {
                type: '1',
                postertype: 'invite',
                path: 'pages/affiliate/affiliateApply/affiliateApply',
                title: '好友邀请你一起分享赢奖励'
            }
        ]
    },

    onLoad(options) {
        // postertype: 1 推广好店 2 申请分享家
        const type = (options && options.postertype) || '2';
        const { qrcodePaths } = this.data;
        let qrcodePathItem = qrcodePaths.find(item => {
            return item.type === type;
        });

        wx.setNavigationBarTitle({
            title: type === '2' ? '推广海报' : '邀请好友'
        });

        const user = wx.getStorageSync(USER_KEY);
        const posterData = {
            ...qrcodePathItem
        };

        const config = wx.getStorageSync(CONFIG) || {};

        const { affiliate_promote_image = '', affiliate_invite_friends_image = '' } = config;

        let banner = type === '2' ? affiliate_promote_image : affiliate_invite_friends_image;

        let share_image = imgToHttps(banner);

        let share_title = qrcodePathItem.title;

        this.setData({
            posterData,
            user,
            share_image,
            share_title,
            isLoading: false
        });
    },

    onShareAppMessage() {
        let { user, posterData } = this.data;
        const opts = {
            afcode: (user && user.afcode) || ''
        };
        const path = '/' + posterData.path;
        return onDefaultShareAppMessage.call(this, opts, path);
    }
});
