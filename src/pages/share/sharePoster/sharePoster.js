import { getNodeInfo, getUserInfo } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { downloadFile } from 'utils/wxp';

const app = getApp();

Page({
    data: {
        title: 'sharePoster',
    },

    async onLoad(parmas) {
        console.log(parmas);

        const user = getUserInfo();
        if (user.avatarurl) {
            const downloadData = await downloadFile({ url: user.avatarurl });
            console.log(downloadData, 'downloadData');
            if (downloadData.statusCode === 200) {
                this.data.tempFilePath = downloadData.tempFilePath;
                const nodeInfo = await getNodeInfo('canvasPosterId');
                this.data.nodeInfo = nodeInfo;
                this.drawPosterImage();
            }
        }
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
        this.data.ctx = ctx;
        const { windowWidth } = app.systemInfo;
        const { width, height } = this.data.nodeInfo;
        ctx.drawImage(sharePosterBg, 0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, 110, width * (120 / 650) / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.tempFilePath, width / 2 - width * (120 / 650) / 2, 110 - width * (120 / 650) / 2, width * (120 / 650), width * (120 / 650));
        ctx.restore();

        ctx.beginPath();
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('center');

        ctx.setFontSize(0.030 * windowWidth);
        ctx.fillText('用户昵称', width / 2, 170);

        ctx.arc(width / 2, 300, width * (288 / 650) / 2, 0, 2 * Math.PI);
        ctx.setFillStyle('#c9c9c9');
        ctx.fill();
        ctx.draw();
    },

    saveCanvasToImg() {
        const { width, height } = this.data.nodeInfo;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: width,
            height: height,
            canvasId: 'canvasPoster',
            quality: 1,
            success: function(res) {
                console.log(res.tempFilePath);
                wx.previewImage({
                    current: res.tempFilePath, // 当前显示图片的http链接
                    urls: [res.tempFilePath] // 需要预览的图片http链接列表
                });
            }
        });
    },

    onShareAppMessage: onDefaultShareAppMessage
});
