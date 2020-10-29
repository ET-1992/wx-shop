import api from 'utils/api';
import { getNodeInfo } from 'utils/util';
import { qrcode } from 'peanut-all';

Page({
    data: {
        title: 'electronicCard',
        isLoading: true,
    },

    onLoad(params) {
        console.log(params);
        let { id } = params;
        this._eid = id;
        this.getCardDetail();
    },

    // 获取卡券详情
    async getCardDetail() {
        let ticket_id = this._eid;
        let { ticket } = await api.hei.fetchMyTicketDetail({ ticket_id });
        this.setData({
            ticket,
            isLoading: false,
        });
        this.getQRCode();
    },

    // onPreviewImg() {
    //     let { image_url } = this.data.ticket;
    //     let urls = [image_url];
    //     wx.previewImage({ urls });
    // },

    // 获取核销二维码
    async getQRCode() {
        let { ticket: { ticket_no }} = this.data;
        let { width, height } = await getNodeInfo('bar-canvas');
        width = width || 110;
        height = height || 110;
        qrcode.api.draw('D-' + ticket_no, 'canvasId', width, height);
    },
});
