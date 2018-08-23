import { getNodeInfo, getUserInfo, autoDrawText, imgToHttps, auth, authGetUserInfo } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { downloadFile, canvasToTempFilePath, saveImageToPhotosAlbum } from 'utils/wxp';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        title: 'affiliatePoster',
        authModal: {},
        options: {},
        share_title: ''
    },

    onLoad(options) {
        // postertype: 1 推广好店 2 申请分享家 3 分享商品
        this.postertype = (options && options.postertype) || '2';
        this.posterFnc = {
            '1': this.drawPosterImage,
            '2': this.drawFriendImage
        };
        this.qrcodePath = {
            '2': 'pages/home/home',
            '1': 'pages/affiliate/affiliateApply/affiliateApply'
        };
        if (this.postertype === '2') {
            wx.setNavigationBarTitle({
                title: '推广海报'
            });
        } else {
            wx.setNavigationBarTitle({
                title: '邀请好友'
            });
        }
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
    },

    async onShow() {
        try {
            wx.showLoading({
                title: '绘制图片中'
            });
            const data = await api.hei.getShareQrcode({ weapp_page: this.qrcodePath[this.postertype] });
            if (data && data.qrcode_url && data.errcode === 0) {
                const qrcodeUrl = imgToHttps(data.qrcode_url);
                const user = getUserInfo();
                console.log(user);
                if (user && user.avatarurl) {
                    const avatarUrlPromise = downloadFile({ url: user.avatarurl });
                    const qrcodeUrlPromise = downloadFile({ url: qrcodeUrl });
                    const datas = await Promise.all([avatarUrlPromise, qrcodeUrlPromise]);
                    console.log(datas, 'datas');
                    const avatarUrlData = datas[0];
                    const qrcodeUrlData = datas[1];
                    // //const httpsimg = imgToHttps(this.data.options.productImg) + '?imageView2/1/w/450/h/450/interlace/1/q/70#';
                    // console.log(httpsimg, 'httpsimg');
                    // const downloadData = await downloadFile({ url: httpsimg });
                    // if (downloadData.statusCode === 200) {
                    //     this.data.tempFilePath = downloadData.tempFilePath;
                    //     const nodeInfo = await getNodeInfo('canvasPosterId');
                    //     console.log(nodeInfo, 'nodeInfo');
                    //     this.data.nodeInfo = nodeInfo;
                    //     this.drawPosterImage();
                    // }

                    if (avatarUrlData.statusCode === 200 && qrcodeUrlData.statusCode === 200) {
                        const nodeInfo = await getNodeInfo('canvasPosterId');
                        this.setData({
                            nodeInfo,
                            avatarUrl: avatarUrlData.tempFilePath,
                            qrcodeUrl: qrcodeUrlData.tempFilePath,
                            user,
                            current_user: data.current_user
                        }, this.posterFnc[this.postertype]);
                    }
                } else {
                    authGetUserInfo({
                        ctx: this
                    });
                }

            }
        } catch (e) {
            wx.hideLoading();
            wx.showToast({
                title: '异常错误,请重试',
                icon: 'none'
            });
        }
    },

    drawPosterImage() {
        const sharePosterBg = 'http://cdn2.wpweixin.com/shop/sharePosterBg.png';
        const ctx = wx.createCanvasContext('canvasPoster');
        this.data.ctx = ctx;
        const { windowWidth } = app.systemInfo;
        const { width, height } = this.data.nodeInfo;
        console.log(width, height);
        ctx.drawImage(sharePosterBg, 0, 0, width, height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.11 * 2, width * (120 / 650) / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.avatarUrl, width / 2 - width * (120 / 650) / 2, height * 0.11 * 2 - width * (120 / 650) / 2, width * (120 / 650), width * (120 / 650));
        ctx.restore();

        ctx.beginPath();
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('center');

        ctx.setFontSize(0.030 * windowWidth);
        ctx.fillText(this.data.user.nickname, width / 2, height * 0.17 * 2);

        ctx.beginPath();
        ctx.rect(width / 2 - width * (288 / 650) / 2, height * 0.34 * 2 - width * (288 / 650) / 2, width * (288 / 650), width * (288 / 650));
        ctx.clip();
        ctx.drawImage(this.data.qrcodeUrl, width / 2 - width * (288 / 650) / 2, height * 0.34 * 2 - width * (288 / 650) / 2, width * (288 / 650), width * (288 / 650));
        ctx.restore();

        ctx.draw();
        wx.hideLoading();
    },

    drawFriendImage() {
        // const shareFriend = '/icons/shareFriend.png';
        const ctx = wx.createCanvasContext('canvasPoster');
        this.data.ctx = ctx;
        const { windowWidth } = app.systemInfo;
        const { width, height } = this.data.nodeInfo;
        console.log(width, height);

        ctx.beginPath();
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, width, height);
        ctx.fill();

        ctx.beginPath();
        ctx.save();
        ctx.arc(width / 2, height * 0.11, width * (120 / 650) / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.avatarUrl, width / 2 - width * (120 / 650) / 2, height * 0.11 - width * (120 / 650) / 2, width * (120 / 650), width * (120 / 650));
        ctx.restore();

        ctx.beginPath();
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('center');
        ctx.setFontSize(0.030 * windowWidth);
        ctx.fillText(this.data.user.nickname, width / 2, height * 0.24);

        ctx.font = 'normal bold 1px PingFang SC';
        ctx.setFontSize(0.040 * windowWidth);
        ctx.fillText('我发现了一家好店，快来看看！', width / 2, height * 0.35);

        ctx.font = 'normal normal 1px PingFang SC';
        ctx.setFontSize(0.030 * windowWidth);
        ctx.fillText('长按识别小程序码访问店铺', width / 2, height * 0.95);

        ctx.beginPath();
        ctx.rect(width / 2 - width * (360 / 650) / 2, height * 0.65 - width * (360 / 650) / 2, width * (360 / 650), width * (360 / 650));
        ctx.clip();
        ctx.drawImage(this.data.qrcodeUrl, width / 2 - width * (360 / 650) / 2, height * 0.65 - width * (360 / 650) / 2, width * (360 / 650), width * (360 / 650));
        ctx.restore();
        ctx.draw();
        wx.hideLoading();
    },

    async drawCanvasToImg() {
        const { width, height } = this.data.nodeInfo;
        const data = await canvasToTempFilePath({
            x: 0,
            y: 0,
            width: width,
            height: height,
            canvasId: 'canvasPoster',
            quality: 1
        });
        return data;
    },

    async saveCanvasToImg() {
        const data = await this.drawCanvasToImg();
        console.log(data, 'data');
        const res = await auth({
            scope: 'scope.writePhotosAlbum',
            ctx: this,
            isFatherControl: true
        });
        if (res) {
            await saveImageToPhotosAlbum({ filePath: data.tempFilePath });
            wx.showModal({
                title: '温馨提示',
                content: '保存成功，打开相册分享到朋友圈吧~',
                showCancel: false,
            });
        }
    },

    onModalCancel() {
        this.setData({
            'authModal.isShowModal': false,
            hiddenCanvas: false
        });
    },

    onModalConfirm() {
        this.setData({
            'authModal.isShowModal': false,
            hiddenCanvas: false
        });
    },

    onSaveUserInfo(e) {
        this.onLoad();
        this.onShow();
    },

    beforeAutoShowModal(e) {
        if (e !== 'scope.userInfo') {
            this.setData({
                hiddenCanvas: true
            });
        }
    },

    onShareAppMessage(res) {
        let { current_user = {}, share_title = '' } = this.data;
        const opts = {
            afcode: current_user.afcode || ''
        };
        const path = '/' + this.qrcodePath[this.postertype];
        return onDefaultShareAppMessage.call(this, opts, path);
    }
});
