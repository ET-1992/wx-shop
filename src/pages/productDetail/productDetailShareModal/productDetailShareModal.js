import { getNodeInfo, getUserInfo, autoDrawText, imgToHttps, auth, authGetUserInfo } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { downloadFile, canvasToTempFilePath, saveImageToPhotosAlbum } from 'utils/wxp';
import api from 'utils/api';

const app = getApp();

Component({
    properties: {
        productImage: {
            type: String,
            value: '',
        },
        productTitle: {
            type: String,
            value: '',
        },
        productPrice: {
            type: String,
            value: '',
        },
        isShowProductDetailShareModal: {
            type: Boolean,
            value: false,
        },
        routeQuery: {
            type: Object,
            value: {},
        },
        routePath: {
            type: String,
            value: '',
        }
    },
    data: {
        nodeInfo: {},
        ctx: {},
        authModal: {},
        productImageUrl: '',
        qrcodeUrl: ''
    },
    async ready() {
        const nodeInfo = await getNodeInfo('canvasPosterId', {}, true, this);
        console.log(nodeInfo);
        const user = getUserInfo();
        this.setData({
            nodeInfo,
            user
        }, this.downImg);
    },
    methods: {
        drawProductDetailImg() {
            // ctm的wx page和components搞两套语法也就算了 api也搞两套 一下午被兼容搞得头大
            const { productTitle, productPrice, productImageUrl, qrcodeUrl, user, nodeInfo } = this.data;
            console.log(productImageUrl);
            console.log(productTitle);
            const ctx = wx.createCanvasContext('canvasPoster', this);
            this.data.ctx = ctx;
            const { windowWidth } = app.systemInfo;
            console.log(this.data);
            const { width, height } = nodeInfo;
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, width, height);

            ctx.save();

            ctx.beginPath();
            ctx.rect(45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height);
            ctx.setFillStyle('#fff');
            ctx.fill();
            ctx.clip();
            ctx.drawImage(productImageUrl || '', 45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height, 450 / 540 * width, 450 / 900 * height);
            ctx.restore();

            ctx.beginPath();
            ctx.setFillStyle('#000000');
            ctx.setTextAlign('left');

            const text = productTitle;
            ctx.font = 'normal normal 18px PingFang SC';
            const textRow = autoDrawText({
                text,
                ctx,
                maxWidth: 410 / 540 * width,
                maxLine: 2
            });

            let height_ = textRow.length === 1 ? 10 : 0;

            textRow.forEach((item, index) => {
                ctx.fillText(item, 45 / 540 * width, 540 / 900 * height + (index === 1 ? 20 : 0) + height_);
            });

            console.log(textRow);
            ctx.beginPath();
            ctx.setFillStyle('#FC2732');
            ctx.fillText('￥' + productPrice, 45 / 540 * width, 640 / 900 * height);

            ctx.beginPath();
            ctx.moveTo(45 / 540 * width, 670 / 900 * height);
            ctx.lineTo(500 / 540 * width, 670 / 900 * height);
            ctx.setLineWidth(1);
            ctx.strokeStyle = '#c2c2c2';
            ctx.stroke();

            ctx.beginPath();
            ctx.setFillStyle('#000000');
            ctx.setTextAlign('left');
            ctx.font = 'normal normal 12px PingFang SC';
            ctx.fillText(`${(user && user.nickname) || '好友'} 向你推荐这个商品`, 50 / 540 * width, 750 / 900 * height);
            ctx.fillText('长按识别小程序访问', 50 / 540 * width, 750 / 900 * height + 30);

            ctx.beginPath();
            ctx.arc(410 / 540 * width, 750 / 900 * height + 15, 75 / 540 * width, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(qrcodeUrl, 410 / 540 * width - 75 / 540 * width, (750 / 900 * height + 15) - 75 / 540 * width, 150 / 540 * width, 150 / 540 * width);
            // ctx.setFillStyle('#c9c9c9');
            // ctx.fill();
            console.log('o00');
            ctx.draw();
            wx.hideLoading();
        },
        async drawCanvasToImg() {
            const { width, height } = this.data.nodeInfo;
            try {
                const data = await canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    canvasId: 'canvasPoster',
                    quality: 1
                }, this);
                return data;
            } catch (e) {
                console.log(e);
            }
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

        beforeAutoShowModal(e) {
            if (e !== 'scope.userInfo') {
                this.setData({
                    hiddenCanvas: true
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

        touchmove() {
            console.log('点击穿透阻止');
            return;
        },

        async downImg() {
            const { routePath, routeQuery } = this.data;
            wx.showLoading({
                title: '绘制图片中'
            });
            const qvcode = await api.hei.getShareQrcode({ weapp_page: 'pages/webPages/webPages', id: routeQuery.id, width: 150 });
            console.log(qvcode);
            if (qvcode.errcode === 0) {
                const { productImage } = this.data;
                const productImage_ = imgToHttps(productImage);
                const qvcode_ = imgToHttps(qvcode.qrcode_url);
                const productImageUrlPromise = downloadFile({ url: productImage_ });
                const qrcodeUrlPromise = downloadFile({ url: qvcode_ });
                const datas = await Promise.all([productImageUrlPromise, qrcodeUrlPromise]);
                console.log(datas, 'datas');
                const productImageUrlData = datas[0];
                const qrcodeUrlData = datas[1];
                this.setData({
                    productImageUrl: productImageUrlData.tempFilePath,
                    qrcodeUrl: qrcodeUrlData.tempFilePath
                }, this.drawProductDetailImg);
            } else {
                wx.hideLoading();
                wx.showToast({
                    title: '异常错误',
                    icon: 'none'
                });
            }
        },

        closeModal() {
            this.triggerEvent('onCloseModal', {}, { bubbles: true });
        }
    }
});

