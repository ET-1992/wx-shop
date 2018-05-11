import api from 'utils/api';
import { USER_KEY } from 'constants/index';
// import login from 'utils/login';

const app = getApp();

let isSubmiting = false;
let isFocusing = false;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: 0,
		is_single: true,
		isLoading: true,
		type: 'topic',
		topic: null,
		user: null,
		text: '',
		reply_to: 0,
		page_title: '',
		share_title: '',
		reply_focus: false,
		placeholder: '发布评论',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { globalData: { themeColor }, systemInfo } = app;
		const user = wx.getStorageSync(USER_KEY);
		const updateData = { themeColor, systemInfo };
		if (user) {
			updateData.user = user;
		}
		this.setData(updateData);

	},

	onShow() {
		const { id } = this.options;
		const user = wx.getStorageSync(USER_KEY);
		if (user) {
			this.setData({ user });
		}
		this.getDetail(id);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	async getDetail(id) {
		const data = await api.hei.articleDetail({ id: id });
		console.log(data);
		this.setData({
			id,
			topic: {
				reply_count: data.article.replies ? data.article.replies.length : 0,
				replies: data.article.replies,
			},
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

	async formSubmit(e) {
		const text = e.detail.value.text.trim();
		if (text === '' || isSubmiting) return;

		isSubmiting = true;

		let args = {
			text: text,
			reply_to: this.data.reply_to,
			form_id: e.detail.formId,
		};

		let res;

		args.post_id = this.data.id;
		res = await api.hei.createReply({ ...args });

		if (res.errcode === 0) {
			this.setData({
				text: '',
				reply_to: 0,
				placeholder: '发布评论',
				reply_focus: false,
			});
			let topic = this.data.topic;
			topic.reply_count = topic.reply_count + 1;
			topic.replies = [].concat(topic.replies, res.reply);
			this.setData({
				topic,
			});
			isSubmiting = false;
		}
	},

	async deleteReply(comment_id) {
		const res = await api.hei.deleteReply({
			id: comment_id,
		});
		if (res.errcode === 0) {
			let topic = this.data.topic;
			topic.reply_count = topic.reply_count - 1;
			topic.replies = topic.replies.filter((item) => item.id !== comment_id);
			this.setData({ topic });
			isSubmiting = false;
		}
	},

	async replyTo(e) {
		const self = this;
		const comment_id = e.currentTarget.dataset.id;
		const username = e.currentTarget.dataset.user;
		const openid = e.currentTarget.dataset.openid;
		let userForm;
		let user = this.data.user.user;

		if (!user || !user.openid) {
			console.log(user);
			userForm = await api.user.login();
			user = await api.hei.getProfile(userForm);
			if (user.user) {
				user = user.user;
			}
			else {
				return;
			}
			this.setData({ user });
		}
		if (openid === user.openid) {
			console.log('删除评论');
			wx.showActionSheet({
				itemList: ['删除评论'],
				itemColor: '#e74c3c',
				success: function (res) {
					if (res.tapIndex === 0) {
						self.deleteReply(comment_id, self.data.type);
					}
				},
			});
		}
		else {
			console.log('其他人评论');
			isFocusing = true;

			// 3.如果是其他人评论则回复
			console.log('reply_to', isFocusing);
			self.setData({
				reply_to: comment_id,
				placeholder: '回复' + username + ':',
				reply_focus: true,
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
		const user = wx.getStorageSync(USER_KEY);
		this.setData({ user });
	},
});
