import api from 'utils/api';
Page({
    data: {
        title: 'picturePage',
        isLoading: true,
        pictureSrc: '',
        pictureTitle: '',
    },

    onLoad(params) {
        console.log(params);
        let { key, pic } = params;
        this.initPageData(key, pic);
    },

    // 渲染页面
    async initPageData(key, pic) {
        if (pic) {
            let pictureTitle = '详细报告';
            // 直接读取图片
            this.setData({
                pictureSrc: pic,
                pictureTitle,
            });
        } else if (key) {
            // 先请求图片再读取
            await this.getContent(key);
        }
        this.setPageData();
    },

    // 从后台获取图片和标题
    async getContent(key) {
        let data = await api.hei.getPicture({ key });
        let { image, title } = data;
        this.setData({
            pictureSrc: image,
            pictureTitle: title,
        });
    },

    // 设置图片和标题
    setPageData() {
        let { pictureSrc, pictureTitle } = this.data;
        wx.setNavigationBarTitle({
            title: pictureTitle
        });
        this.setData({
            imgUrl: pictureSrc,
            isLoading: false,
        });
    }
});
