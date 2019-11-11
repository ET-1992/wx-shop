import api from 'utils/api';
import { getAgainUserForInvalid, getUserInfo } from 'utils/util';

const app = getApp();

let isSubmiting = false;
let isFocusing = false;
Page({
    data: {
        isLoading: true,
        topic: null,
        user: null,
        text: '',
        reply_to: 0,
        reply_focus: false,
        placeholder: '发布评论',
    },

    onLoad(options) {
        const { globalData: { themeColor }, systemInfo } = app;
        this.setData({
            themeColor,
            systemInfo
        });
    },

    onShow() {
        const { id } = this.options;
        const user = getUserInfo();
        this.setData({ user });
        this.getDetail(id);
    },

    async getDetail(id) {
        const data = await api.hei.articleDetail({ id });
        this.setData({
            id,
            topic: {
                reply_count: data.article.replies ? data.article.replies.length : 0,
                replies: data.article.replies,
            },
            isLoading: false
        });
        if (data.page_title) {
            wx.setNavigationBarTitle({
                title: data.page_title,
            });
        }
    },
    wxParseTagATap(e) {
        wx.navigateTo({
            url: '/' + e.currentTarget.dataset.src,
            success: function (res) {
                console.log('跳转成功');
            },
        });
    },

    async onUserInfo(ev) {
        const { encryptedData, iv } = ev.detail;
        if (encryptedData && iv) {
            await getAgainUserForInvalid({ encryptedData, iv });
            await this.submitComment();
        }
        else {
            wx.showModal({
                title: '温馨提示',
                content: '需授权后操作',
                showCancel: false,
            });
        }

    },

    async formSubmit(ev) {
        console.log(ev);
        const text = ev.detail.value.text.trim();
        const formId = ev.detail.formId;
        this.setData({ text, formId });
    },

    async submitComment() {
        try {
            const { formId, text, reply_to, topic, id } = this.data;
            if (!text) {
                wx.showToast({
                    title: '请输入内容',
                    icon: 'none',
                    mask: true
                });
                return;
            }

            let args = {
                text,
                reply_to,
                form_id: formId,
                post_id: id
            };

            const { reply } = await api.hei.createReply(args);

            // status: -1 审核中
            // status: 1 正常
            if (reply.status === 1) {
                topic.reply_count = topic.reply_count + 1;
                topic.replies = [].concat(topic.replies, reply);
            } else if (reply.status === -1) {
                wx.showToast({
                    title: '发布成功，请等待后台审核',
                    icon: 'none',
                    mask: true
                });
            }

            this.setData({
                topic,
                text: '',
                reply_to: 0,
                placeholder: '发布评论',
                reply_focus: false,
            });
        } catch (e) {
            wx.showModal({
                title: '温馨提示',
                content: e.errMsg,
                showCancel: false
            });
        }
    },

    // async deleteReply(comment_id) {
    //     try {
    //         const { topic } = this.data;
    //         await api.hei.deleteReply({ id: comment_id, });
    //         topic.reply_count = topic.reply_count - 1;
    //         topic.replies = topic.replies.filter((item) => item.id !== comment_id);
    //         this.setData({ topic });
    //         isSubmiting = false;
    //     } catch (e) {
    //         wx.showModal({
    //             title: '温馨提示',
    //             content: e.errMsg,
    //             showCancel: false
    //         });
    //     }
    // },

    async replyTo(e) {
        const { iv, encryptedData } = e.detail;
        const { id, nickname, openid } = e.currentTarget.dataset;
        const { user } = this.data;
        if (!user || !user.openid) {
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({ user });
        }
        if (openid === user.openid) {
            // 自己评论则删除
            console.log('删除评论');
            // let that = this;
            // wx.showActionSheet({
            //     itemList: ['删除评论'],
            //     itemColor: '#e74c3c',
            //     success: (res) => {
            //         if (res.tapIndex === 0) {
            //             that.deleteReply(id);
            //         }
            //     }
            // });
        } else {
            // 其他人评论则回复
            isFocusing = true;
            this.setData({
                reply_to: id,
                placeholder: '回复' + nickname + ':',
                reply_focus: true
            });
        }
    },

    onReplyBlur(e) {
        console.log('onReplyBlur', isFocusing);
        if (!isFocusing) {
            const text = e.detail.value.trim();

            // 只有输入内容为空的时候, 输入框失焦才会重置回复对象
            if (text === '') {

                // 保证先提交评论再重置
                // setTimeout(() => {
                this.setData({
                    reply_to: 0,
                    placeholder: '发布评论',
                    reply_focus: false,
                });

                // }, 50)
            }
        }
    },

    onRepleyFocus() {
        isFocusing = false;
        console.log('onRepleyFocus', isFocusing);
        if (!this.data.reply_focus) {
            this.setData({ reply_focus: true });
        }
    },

    reLoad() {
        const user = getUserInfo;
        this.setData({ user });
    },
});
