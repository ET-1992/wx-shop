import api from 'utils/api';
import { go, getUserProfile, autoNavigate_ } from 'utils/util';
import { onDefaultShareAppMessage } from 'utils/pageShare';

Page({
    data: {
        comment: '',
        comments: [],
        replyParentId: null,
        placeholder: '请输入评论',
        isShowInputBox: false,
        showPosterModal: false,
        posterData: {}
    },

    onLoad(parmas) {
        console.log(parmas);
        this.setData({
            ...parmas
        }, this.articleDetail);
    },

    go,

    async goPage(e) {
        const { item } = e.currentTarget.dataset;
        if (item.format === 'link') {
            autoNavigate_({ url: `/pages/webPages/webPages?src=${item.format_content.link}` });
        } else {
            autoNavigate_({ url: `/pages/articleDetail/articleDetail?id=${item.id}` });
        }
    },

    async bindGetUserInfo(ev) {
        const { method } = ev.currentTarget.dataset;

        const user = await getUserProfile();
        this.setData({ current_user: user }, this[method]);

    },

    async onDiggComment(ev) {
        try {
            const { index, childIndex, commentId, isDigged } = ev.currentTarget.dataset;
            let method = isDigged ? 'undiggComment' : 'diggComment';
            const { comment: { is_digged, digg_count }} = await api.hei[method]({ comment_id: commentId });
            let item = childIndex >= 0 ? `comments[${index}].children[${childIndex}]` : `comments[${index}]`;
            this.setData({
                [`${item}.is_digged`]: is_digged,
                [`${item}.digg_count`]: digg_count
            });
        } catch (err) {
            console.log(err);
        }
    },

    async articleDetail() {
        try {
            wx.showLoading({ title: '加载中', mask: true });
            const { id = '' } = this.data;
            const data = await api.hei.articleDetail({ id });
            const { replies } = data.article;
            this.setData({
                ...data,
                comments: replies
            });
            const { page_title } = this.data;
            wx.setNavigationBarTitle({
                title: page_title
            });
            wx.hideLoading();
        } catch (err) {
            console.log(err);
            wx.hideLoading();
        }

    },

    showInputBox() {
        const { isShowInputBox } = this.data;
        this.setData({
            isShowInputBox: !isShowInputBox
        });
    },

    onComment() {
        this.setData({
            placeholder: '请输入评论'
        }, this.showInputBox);
    },

    onReply(ev) {
        console.log(ev);
        const { replyParentId, replyUser } = ev.currentTarget.dataset;
        this.setData({
            replyParentId,
            placeholder: `回复${replyUser}`
        }, this.showInputBox);
    },

    onChangeInput(ev) {
        console.log(ev);
        const { value } = ev.detail;
        this.setData({ comment: value });
    },

    async onSubmit() {
        try {
            const { id, comment, replyParentId } = this.data;
            if (!comment) {
                wx.showToast({ title: '评论内容不能为空', icon: 'none' });
                return;
            }
            wx.showLoading({
                title: '请求中...',
                mask: true
            });
            let requestData = {
                post_id: id,
                comment
            };
            if (replyParentId) {
                requestData.parent = replyParentId;
            }
            await api.hei.createReply(requestData);
            this.setData({
                comment: '',
                replyParentId: null,
                isShowInputBox: false
            });
            wx.hideLoading();
            wx.showToast({
                title: '评论成功！',
                icon: 'success'
            });
            this.articleDetail();
        } catch (e) {
            wx.hideLoading();
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false
            });
        }
    },

    onShowPoster() {
        const { id, banner, title, excerpt, author } = this.data.article;
        let posterData = {
            id,
            banner,
            title,
            author,
            excerpt
        };
        this.setData({
            showPosterModal: true,
            isShowShareModal: false,
            posterData
        });
    },

    onClosePoster() {
        this.setData({
            showPosterModal: false
        });
    },

    onShareAppMessage: onDefaultShareAppMessage
});
