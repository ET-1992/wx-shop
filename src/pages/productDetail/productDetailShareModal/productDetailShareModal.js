import { getNodeInfo, getUserInfo, autoDrawText, imgToHttps, auth, authGetUserInfo } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';
import { downloadFile, canvasToTempFilePath, saveImageToPhotosAlbum } from 'utils/wxp';
import api from 'utils/api';

const app = getApp();

Component({
    properties: {
        title: {
            type: String,
            value: 'productDetailShareModal Component',
        }
    },
    data: {
        nodeInfo: {},
        ctx: {}
    },
    async ready() {
        const nodeInfo = await getNodeInfo('canvasPosterId', {}, true, this);
        console.log(nodeInfo);
        this.data.nodeInfo = nodeInfo;
        this.drawProductDetailImg();
    },
    methods: {
        drawProductDetailImg() {
            // ctm的wx page和components搞两套语法也就算了 api也搞两套 一下午被兼容搞得头大
            const ctx = wx.createCanvasContext('canvasPoster', this);
            this.data.ctx = ctx;
            const { windowWidth } = app.systemInfo;
            console.log(this.data);
            const { width, height } = this.data.nodeInfo;
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, width, height);

            ctx.save();

            ctx.beginPath();
            ctx.rect(45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height);
            ctx.setFillStyle('red');
            ctx.fill();
            // ctx.clip();
            // ctx.drawImage(this.data.tempFilePath, 45 / 540 * width, 32 / 900 * height, 450 / 540 * width, 450 / 900 * height, 450 / 540 * width, 450 / 900 * height);
            ctx.restore();

            ctx.beginPath();
            ctx.setFillStyle('#000000');
            ctx.setTextAlign('left');
            console.log('2');

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
            ctx.setLineWidth(1);
            ctx.strokeStyle = '#c2c2c2';
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
            console.log('o00');
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
                isFatherControl: false
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
    }
});

