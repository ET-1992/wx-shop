import api from 'utils/api';

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
    },

    onPreviewImg() {
        let { image_url } = this.data.ticket;
        let urls = [image_url];
        wx.previewImage({ urls });
    },
});
