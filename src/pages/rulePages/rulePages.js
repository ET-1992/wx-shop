import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { onDefaultShareAppMessage } from 'utils/pageShare';

const app = getApp();

Page({

    data: {
        after_sales_imgs: [],
        config: {},
        current_user: {},
        wechat_number: '',
        phone_number: '',
        image_url: '',
        title: '',
        key: '',
        share_title: '',
        share_image: '',
    },

    async onLoad({ key }) {
        console.log({ key });
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        const {
            image_url,
            title = '规则页',
            share_title,
            share_image,
            phone_number,
            wechat_number,
            after_sales_imgs,
            config,
            current_user
        } = await api.hei.getShopRule({
            key
        });
        wx.setNavigationBarTitle({
            title,
        });
        this.setData({
            image_url,
            title,
            share_title,
            share_image,
            phone_number,
            wechat_number,
            after_sales_imgs,
            current_user,
            key,
            config
        });
        wx.hideLoading();
    },

    /* 拨打售后电话 */
    call(e) {
        if (this.data.phone_number) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
            return;
        }
        wx.showToast({
            title: '无售后电话可拨打',
            icon: 'none'
        });
    },

    // 展示企业微信联系方式
    onCustomService() {
        let customServiceModal = true;
        this.setData({
            customServiceModal,
        });
    },

    /* 复制 */
    async setClipboardVp(e) {
        const { value } = e.currentTarget.dataset;
        console.log(e);
        if (value) {
            await proxy.setClipboardData({ data: String(value) });
            wx.showToast({
                title: '复制成功',
                icon: 'success'
            });
            return;
        }
        wx.showToast({
            title: '无内容可复制',
            icon: 'none'
        });
    },
    /* 点击图片放大 */
    preview(e) {
        const { after_sales_imgs } = this.data;
        const { index } = e.currentTarget.dataset;
        wx.previewImage({
            current: after_sales_imgs[index], // 当前显示图片的http链接
            urls: after_sales_imgs // 需要预览的图片http链接列表
        });
    },

    onShareAppMessage: onDefaultShareAppMessage,
});