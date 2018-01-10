import api from 'utils/api';
import { showActionSheet } from 'utils/wxp'
import { UID_KEY } from 'constants/index';

const app = getApp();


export const toggleLike = async ({ id, is_liked, like_count, likes }) => {
	const method = is_liked ? 'topicUnlike' : 'topicLike';
	let res = {};
	try {
		res = await api.koolt[method]({ topic_id: id });

		const { user } = res;

		const addNum = is_liked ? -1 : 1;

		// res.topicId = id;
		res.is_liked = is_liked ? 0 : 1;
		res.like_count = like_count + addNum;

		if (is_liked) {
			res.likes = likes.filter((likeUser) => likeUser.openid !== user.openid);
		}
		else {
			res.likes = likes.concat([user]);
		}

		console.log('toggleLike res: ', res);
		app.syncGlobalTopicData(id, res);

		wx.showToast({
			title: res.errmsg,
		});

		return res;
	}
	catch (err) {
		console.error(err);
		return res;
	}
};

export const toggleFav = async ({ id, is_faved }) => {
	const method = is_faved ? 'topicUnfav' : 'topicFav';
	let res = {};
	try {
		res = await api.koolt[method]({ topic_id: id });

		res.is_faved = is_faved ? 0 : 1;

		app.syncGlobalTopicData(id, res);

		wx.showToast({
			title: res.errmsg,
		});
		console.log('toggleFav res: ', res);
		return res;
	}
	catch (err) {
		console.error(err);
		return res;
	}
};

export const listComment = async function(openid) {
	const uid = wx.getStorageSync(UID_KEY);
	if (uid === openid) {
		const res = await showActionSheet({
			itemList: ['删除评论'],
			itemColor: '#e74c3c'
		});
		return res;
	}
};

