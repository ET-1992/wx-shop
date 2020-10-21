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
        hasMore: true,
        commentList: [],  // 展示的评论信息
    },
    lifetimes: {
        attached() {
            let { comments } = this.data,
                commentList = [];

            commentList = comments;
            if (comments.length > 2) {
                commentList = comments.slice(0, 2);
            }
            this.setData({ commentList });
        },
    },
    methods: {
        // 获取更多评论
        async onMoreComments() {
            const { postId: post_id } = this.data;
            try {
                const data = await api.hei.productCommentList({ post_id });
                this.setData({
                    commentList: data.replies,
                    hasMore: false
                });
                // this.triggerEvent('moreComment');
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