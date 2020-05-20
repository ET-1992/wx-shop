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
        },
        replyCount: {
            type: Number,
            value: 0
        }
    },
    data: {
        hasMore: true
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
            const newImages = [];
            const { items, index } = ev.currentTarget.dataset;
            console.log(index, items);
            items.forEach(item => {
                newImages.push(item.original);
            });
            console.log(newImages);
            wx.previewImage({
                urls: newImages,
                current: newImages[index]
            });
        }
    }
});