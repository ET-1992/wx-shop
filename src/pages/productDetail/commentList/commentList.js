import api from 'utils/api';

Page({
    data: {
        title: 'commentList',
        commentList: [],
    },

    onLoad(params) {
        console.log(params);
        let { id } = params;
        this._id = id;
        this.getCommentList();
    },

    // 获取评论列表
    async getCommentList() {
        let post_id = this._id;
        try {
            const data = await api.hei.productCommentList({ post_id });
            this.setData({
                commentList: data.replies,
            });
        }
        catch (e) {
            console.log(e);
        }
    },
});
