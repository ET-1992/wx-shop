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
        },
        showPart: {
            type: Number,
            value: true,
        },
    },
    data: {
        commentList: [],  // 展示的评论信息
    },
    observers: {
        'comments, replyCount, showPart': function(comments, replyCount, showPart) {
            let commentList = comments;
            if (showPart && replyCount > 2) {
                commentList = comments.slice(0, 2);
            }
            this.setData({ commentList });
        },
    },
    methods: {
        // 获取更多评论
        async onMoreComments() {
            const { postId: post_id } = this.data;
            let url = '/pages/productDetail/commentList/commentList';
            url += `?id=${post_id}`;
            wx.navigateTo({ url });
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