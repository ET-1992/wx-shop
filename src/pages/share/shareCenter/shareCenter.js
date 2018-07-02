Page({
    data: {
        title: 'shareCenter',
        isShowModal: false,
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    changeModal() {
        this.setData({
            isShowModal: !this.data.isShowModal
        });
    }
});
