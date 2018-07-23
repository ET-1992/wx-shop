import { getNodeInfo, getUserInfo, autoDrawText, imgToHttps, auth, authGetUserInfo } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { downloadFile, canvasToTempFilePath, saveImageToPhotosAlbum } from 'utils/wxp';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        title: 'sharePoster',
        authModal: {},
        options: {}
    },

    onLoad(options) {
        // postertype: 1 推广好店 2 申请分享家 3 分享商品
        this.postertype = options && options.postertype;
        this.posterFnc = {
            '1': this.drawPosterImage,
            '2': this.drawFriendImage,
            '3': this.drawProductDetailImg
        };
        this.qrcodePath = {
            '1': 'pages/home/home',
            '2': 'pages/share/shareApply/shareApply',
            '3': 'pages/productDetail/productDetail'
        };
    },

    async onShow(options) {
        const data = await api.hei.getShareQrcode({ weapp_page: this.qrcodePath[this.postertype] });
        if (data && data.qrcode_url) {
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
                        user
                    }, this.posterFnc[this.postertype]);
                }
            } else {
                authGetUserInfo({
                    ctx: this
                });
            }

        }
    },

    drawPosterImage() {
        const sharePosterBg = '/icons/sharePosterBg.png';
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
        ctx.arc(width / 2, height * 0.34 * 2, width * (288 / 650) / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.qrcodeUrl, width / 2 - width * (288 / 650) / 2, height * 0.34 * 2 - width * (288 / 650) / 2, width * (288 / 650), width * (288 / 650));
        ctx.restore();

        ctx.draw();
    },

    drawFriendImage() {
        // const shareFriend = '/icons/shareFriend.png';
        const ctx = wx.createCanvasContext('canvasPoster');
        this.data.ctx = ctx;
        const { windowWidth } = app.systemInfo;
        const { width, height } = this.data.nodeInfo;
        console.log(width, height);
        // ctx.drawImage(shareFriend, 0, 0, width, height);
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
        ctx.arc(width / 2, height * 0.65, width * (360 / 650) / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.qrcodeUrl, width / 2 - width * (360 / 650) / 2, height * 0.65 - width * (360 / 650) / 2, width * (360 / 650), width * (360 / 650));
        ctx.restore();


        ctx.draw();
    },

    drawProductDetailImg() {
        const ctx = wx.createCanvasContext('canvasPoster');
        this.data.ctx = ctx;
        const { windowWidth } = app.systemInfo;
        const { width, height } = this.data.nodeInfo;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, width, height);
        ctx.save();

        ctx.beginPath();
        ctx.rect(45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height);
        ctx.clip();
        ctx.drawImage(this.data.tempFilePath, 45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height, 450 / 540 * width, 450 / 900 * height);
        ctx.restore();

        ctx.beginPath();
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('left');

        const text = '风吹蛋蛋凉风吹蛋蛋凉风吹蛋蛋凉风吹蛋蛋凉风吹蛋蛋凉风吹蛋蛋凉风吹蛋蛋凉';
        ctx.font = 'normal normal 18px PingFang SC';
        const textRow = autoDrawText({
            text,
            ctx,
            maxWidth: 410 / 540 * width,
            maxLine: 2
        });
        console.log(textRow);

        let height_ = textRow.length === 1 ? 10 : 0;

        textRow.forEach((item, index) => {
            ctx.fillText(item, 45 / 540 * width, 540 / 900 * height + (index === 1 ? 20 : 0) + height_);
        });

        console.log(textRow);
        ctx.beginPath();
        ctx.setFillStyle('#FC2732');
        ctx.fillText('￥999', 45 / 540 * width, 640 / 900 * height);

        ctx.beginPath();
        ctx.moveTo(45 / 540 * width, 670 / 900 * height);
        ctx.lineTo(500 / 540 * width, 670 / 900 * height);
        ctx.stroke();

        ctx.beginPath();
        ctx.setFillStyle('#000000');
        ctx.setTextAlign('left');
        ctx.font = 'normal normal 12px PingFang SC';
        ctx.fillText(`xxx向你推荐这个商品`, 50 / 540 * width, 750 / 900 * height);
        ctx.fillText('长按识别小程序访问', 50 / 540 * width, 750 / 900 * height + 30);

        ctx.beginPath();
        ctx.arc(410 / 540 * width, 750 / 900 * height + 15, 75 / 540 * width, 0, 2 * Math.PI);
        ctx.setFillStyle('#c9c9c9');
        ctx.fill();
        ctx.draw();
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

    onShareAppMessage() {
        console.log('90');
        return {
            title: '我发现了一家好店，快来看看',
            path: 'pages/share/shareApply/shareApply',
            imageUrl: this.data.tempFilePath || ''
        };
    }
});
