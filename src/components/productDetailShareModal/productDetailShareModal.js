import { getNodeInfo, getUserInfo, autoDrawText, imgToHttps, auth, authGetUserInfo } from 'utils/util';
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
        originalPrice: {
            type: String,
            value: '',
        },
        grouponLimit: {
            type: String,
            value: '',
        },
        remainSecond: {
            type: String,
            value: '',
        },
        remainTime: {
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
        },
        isGroupon: {
            type: Boolean,
            value: false,
        },
        isMiaosha: {
            type: Boolean,
            value: false,
        },
        miaoshaObj: {
            type: Object,
            value: {}
        },
    },
    data: {
        nodeInfo: {},
        ctx: {},
        authModal: {},
        productImageUrl: '',
        qrcodeUrl: '',
        qvcode: {}
    },
    async ready() {
        const nodeInfo = await getNodeInfo('canvasPosterId', {}, true, this);
        console.log(nodeInfo);
        const user = getUserInfo();
        const { themeColor } = app.globalData;
        this.setData({
            nodeInfo,
            user,
            themeColor
        }, this.downImg);
        console.log(this.data);
    },
    methods: {
        drawProductDetailImg() {
            // ctm的wx page和components搞两套语法也就算了 api也搞两套 一下午被兼容搞得头大
            const { productTitle, productPrice, originalPrice, grouponLimit, remainSecond, remainTime, productImageUrl, qrcodeUrl, user, nodeInfo, routeQuery, isMiaosha, miaoshaObj, qvcode } = this.data;
            console.log(productImageUrl);
            console.log(productTitle);
            const ctx = wx.createCanvasContext('canvasPoster', this);
            this.data.ctx = ctx;
            const { windowWidth } = app.systemInfo;
            console.log(this.data);
            const { width, height } = nodeInfo;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, width, height);

            ctx.save();

            ctx.beginPath();
            ctx.rect(45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.clip();
            ctx.drawImage(productImageUrl || '', 45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height, 450 / 540 * width, 450 / 900 * height);
            ctx.restore();

            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.setTextAlign('left');

            const text = productTitle;
            ctx.font = 'normal normal 16px PingFang SC';
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
            const globalData = app.globalData;
            if (!isMiaosha && !routeQuery.grouponId) {
                ctx.beginPath();
                ctx.fillStyle = '#FC2732';
                ctx.fillText(globalData.CURRENCY[globalData.currency] + productPrice, 45 / 540 * width, 640 / 900 * height);
            }

            if (!routeQuery.grouponId && !isMiaosha) {
                ctx.beginPath();
                ctx.moveTo(45 / 540 * width, 670 / 900 * height);
                ctx.lineTo(500 / 540 * width, 670 / 900 * height);
                ctx.lineWidth(1);
                ctx.strokeStyle = '#c2c2c2';
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.setTextAlign('left');
            ctx.font = 'normal bold 12px PingFang SC';

            if (routeQuery.grouponId) {
                console.log(qvcode, 'qvcode');
                const { product = null }  = qvcode;
                if (remainSecond > 0) {
                    ctx.fillStyle = '#000000';
                    ctx.font = 'normal bold 14px PingFang SC';
                    ctx.fillText('距拼团结束', 45 / 540 * width, 750 / 900 * height - 15);
                    ctx.fillStyle = '#FC2732';
                    ctx.font = 'normal bold 12px PingFang SC';
                    ctx.fillText(remainTime, 45 / 540 * width + 75, 750 / 900 * height - 15);
                } else {
                    ctx.fillStyle = '#000000';
                    ctx.font = 'normal bold 14px PingFang SC';
                    ctx.fillText('已结束', 45 / 540 * width, 750 / 900 * height - 15);
                }

                ctx.fillStyle = '#707070';
                ctx.font = 'normal 12px PingFang SC';
                ctx.fillText('单独购买' + globalData.CURRENCY[globalData.currency] + (product ? product.price : originalPrice), 45 / 540 * width, 750 / 900 * height + 15);

                ctx.fillStyle = '#FC2732';
                ctx.font = 'normal 12px PingFang SC';
                ctx.fillText(globalData.CURRENCY[globalData.currency], 45 / 540 * width, 750 / 900 * height + 45);
                ctx.font = 'normal bold 18px PingFang SC';
                ctx.fillText(productPrice, 45 / 540 * width + 12, 750 / 900 * height + 45);

                ctx.font = 'normal 12px PingFang SC';
                ctx.fillStyle = '#FC2732';
                ctx.fillText(grouponLimit + '人团', 45 / 540 * width + 70, 750 / 900 * height + 45);
            } else if (isMiaosha && miaoshaObj) {
                ctx.fillStyle = '#000000';
                ctx.font = 'normal bold 14px PingFang SC';
                if (!miaoshaObj.hasStart) {
                    ctx.fillText('距活动开始', 45 / 540 * width, 750 / 900 * height - 15);
                }
                if (miaoshaObj.hasStart && !miaoshaObj.hasEnd) {
                    ctx.fillText('距活动结束', 45 / 540 * width, 750 / 900 * height - 15);
                }
                if (miaoshaObj.hasEnd) {
                    ctx.fillText('活动已结束', 45 / 540 * width, 750 / 900 * height - 15);
                }
                if (!miaoshaObj.hasStart || (miaoshaObj.hasStart && !miaoshaObj.hasEnd)) {
                    ctx.fillStyle = '#FC2732';
                    ctx.font = 'normal bold 12px PingFang SC';
                    ctx.fillText(miaoshaObj.remainTime, 45 / 540 * width + 75, 750 / 900 * height - 15);
                }
                ctx.fillStyle = '#707070';
                ctx.font = 'normal 12px PingFang SC';
                ctx.fillText('原价购买' + globalData.CURRENCY[globalData.currency] + miaoshaObj.price + (miaoshaObj.price < miaoshaObj.highest_price ? '~' + miaoshaObj.highest_price : ''), 45 / 540 * width, 750 / 900 * height + 15);

                ctx.fillStyle = '#FC2732';
                ctx.font = 'normal 12px PingFang SC';
                ctx.fillText(globalData.CURRENCY[globalData.currency], 45 / 540 * width, 750 / 900 * height + 45);
                ctx.font = 'normal bold 18px PingFang SC';
                ctx.fillText(miaoshaObj.miaosha_price, 45 / 540 * width + 12, 750 / 900 * height + 47);

                ctx.beginPath();
                ctx.moveTo(45 / 540 * width + 110, 750 / 900 * height + 32);
                ctx.lineTo(45 / 540 * width + 65, 750 / 900 * height + 32);
                ctx.lineTo(45 / 540 * width + 65, 750 / 900 * height + 49);
                ctx.lineTo(45 / 540 * width + 110, 750 / 900 * height + 49);
                ctx.lineTo(45 / 540 * width + 110, 750 / 900 * height + 32);
                ctx.closePath();
                ctx.fillStyle = '#FC2732';
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#FC2732';
                ctx.fill();
                ctx.stroke();

                ctx.font = 'normal 12px PingFang SC';
                ctx.fillStyle = '#fff';
                ctx.fillText('限时价', 45 / 540 * width + 70, 750 / 900 * height + 45);
            }
            else {
                ctx.fillText((user && user.affiliate_share_name) || '好友', 50 / 540 * width, 750 / 900 * height);
                ctx.fillText(this.data.routeQuery.crowd_pay_no ? '很想要这个商品' : '向你推荐这个商品', 50 / 540 * width, 750 / 900 * height + 15);
                ctx.fillText(this.data.routeQuery.crowd_pay_no ? '邀请你给TA赞助' : '长按识别小程序访问', 50 / 540 * width, 750 / 900 * height + 30);
            }
            ctx.beginPath();
            ctx.rect(410 / 540 * width - 55 / 540 * width, (750 / 900 * height + 10) - 75 / 540 * width, 150 / 540 * width, 150 / 540 * width);
            ctx.clip();
            ctx.drawImage(qrcodeUrl, 410 / 540 * width - 55 / 540 * width, (750 / 900 * height + 10) - 75 / 540 * width, 150 / 540 * width, 150 / 540 * width);
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
                let that = this;
                const { qvcode } = this.data;
                await saveImageToPhotosAlbum({ filePath: data.tempFilePath });
                wx.showModal({
                    title: '温馨提示',
                    content: qvcode.save_success_tips ? qvcode.save_success_tips : '保存成功，快去分享吧',
                    showCancel: false,
                    success: function() {
                        that.closeModal();
                    }
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

        detached() {
            wx.hideLoading();
        },
        async downImg() {
            try {
                const { routePath, routeQuery } = this.data;
                wx.showLoading({
                    title: '绘制图片中'
                });
                let options = {
                    weapp_page: 'pages/webPages/webPages',
                    width: 150
                };

                let scene = {};
                if (routeQuery.afcode) {
                    scene.afcode = routeQuery.afcode;
                }
                if (routeQuery.id) {		// 商品详情
                    scene.id = routeQuery.id;
                }
                if (routeQuery.grouponId) {		// 邀请拼团海报
                    scene.gid = routeQuery.grouponId;
                    options.post_id = routeQuery.post_id;
                    options.sku_id = routeQuery.sku_id;
                }
                if (routeQuery.crowd_pay_no) {	// 代付
                    scene.c = routeQuery.crowd_pay_no;
                }

                console.log(scene, 'scene');
                console.log(options, 'options');

                const qvcode = await api.hei.getShopQrcode({
                    ...options,
                    scene: Object.keys(scene).map(k => (k) + '=' + (scene[k])).join('&')
                });
                console.log(qvcode, 'qvcode');

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
                        qrcodeUrl: qrcodeUrlData.tempFilePath,
                        qvcode
                    }, this.drawProductDetailImg);
                }
            } catch (e) {
                wx.hideLoading();
                wx.showToast({
                    title: e.errMsg || '异常错误，请重试',
                    icon: 'none'
                });
            }
        },

        closeModal() {
            wx.hideLoading();
            this.triggerEvent('onCloseModal', {}, { bubbles: true });
        }
    }
});

