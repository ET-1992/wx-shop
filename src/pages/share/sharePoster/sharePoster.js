import { getNodeInfo } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';

const app = getApp();

Page({
    data: {
        title: 'sharePoster',
    },

    async onLoad(parmas) {
        console.log(parmas);
        const nodeInfo = await getNodeInfo('canvasPosterId');
        this.data.nodeInfo = nodeInfo;
        console.log(nodeInfo, 'nidefdfdfd');
        this.drawPosterImage();
        // wx.showNavigationBarLoading();
        // wx.setNavigationBarTitle({
        //     title: '当前页面'
        // });
        // wx.showModal({
        //     title: '提现',
        //     content: '提现前请先到分享中心完善个人资料',
        //     success: function(res) {
        //         if (res.confirm) {
        //             console.log('用户点击确定');
        //         } else if (res.cancel) {
        //             console.log('用户点击取消');
        //         }
        //     }
        // });
        this.setData({
            share_title: '精品好店'
        });
    },

    drawPosterImage() {
        const sharePosterBg = '/icons/sharePosterBg.png';
        const shareFriend = '/icons/shareFriend.png';
        const ctx = wx.createCanvasContext('canvasPoster');
        const { windowWidth } = app.systemInfo;
        const { width, height } = this.data.nodeInfo;
        ctx.drawImage(sharePosterBg, 0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, 110, width * (120 / 650) / 2, 0, 2 * Math.PI);
        ctx.setFillStyle('#EEEEEE');
        ctx.fill();

        ctx.beginPath();
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('center');

        ctx.setFontSize(0.030 * windowWidth);
        ctx.fillText('用户昵称', width / 2, 170);

        ctx.draw();
    },

    onShareAppMessage: onDefaultShareAppMessage
});
