import api from 'utils/api';

Page({
    data: {
        title: 'shareCenter',
        isShowModal: false,
        loading: true
    },

    onLoad(parmas) {
        console.log(parmas);
        wx.showLoading();
    },
    async onShow() {
        const data = await api.hei.shareUserInfo();
        console.log(data, 'data');
        wx.hideLoading();
    },
    changeModal() {
        this.setData({
            isShowModal: !this.data.isShowModal
        });
    }
});
