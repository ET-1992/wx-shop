import api from 'utils/api';
Component({
    properties: {
        comments: {
            type: Object,
            value: {}
        },
        postId: {
            type: Number,
            value: 0
        }
    },
    data: {
        hasMore: true,
        newImages: []
    },
    methods: {
        async moreComments() {
            const post_id = this.data.postId;
            try {
                const data = await api.hei.productCommentList({ post_id });
                this.setData({
                    comments: data.replies,
                    hasMore: false
                });
            }
            catch (e) {
                console.log(e);
            }
        },
        previewImage(ev) {
            const { comments } = this.data;
            const { index } = ev.currentTarget.dataset;
            comments.forEach(item => {
                item.images.forEach(item => {
                    this.data.newImages.push(item.original);
                });
            });
            wx.previewImage({
                urls: this.data.newImages,
                current: this.data.newImages[index]
            });
        }
    }
});