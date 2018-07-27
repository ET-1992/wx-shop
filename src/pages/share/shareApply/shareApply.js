import api from 'utils/api';
import { showToast, showModal } from 'utils/wxp';
import { checkPhone, checkQQ } from 'utils/util';
Page({
    data: {
        title: 'shareApply',
        image_url: '',
        is_affiliate_member: false,
        affiliate_enable: false,
        isShowModal: false,
        showBtn: false,
        wechatId: '',   // 微信号
        qqId: '',   // qq号
        phoneNumber: '',    // 手机号
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    async onShow() {
        this.setData({
            isLoading: true
        });
        const data = await api.hei.getWelcomeShare();
        console.log(data);
        this.setData({
            ...data,
            isLoading: false
        }, this.redirectToHome);
    },
    /* 图片加载完毕回调 */
    isLoaded(e) {
        console.log(e.detail);
        this.setData({
            showBtn: true
        });
    },

    /* 验证手机 */
    check(e) {
        const { value } = e.detail;
        if (!checkPhone(value)) {
            this.setData({
                'isError.phone': true
            });
        }
    },
    reset() {
        this.setData({
            'isError.phone': false
        });
    },

    getUserIdCardPhoneNumber(e) {
        this.setData({ phoneNumber: e.detail.value });
    },

    getUserWechatId(e) {
        this.setData({ wechatId: e.detail.value });
    },

    getUserQQId(e) {
        this.setData({ qqId: e.detail.value });
    },
    async submitApply() {
        let that = this;
        if (that.data.phoneNumber.length === 0) {
            wx.showToast({ title: '手机号不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!checkPhone(that.data.phoneNumber)) {
            wx.showToast({ title: '请输入正确的手机号', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (that.data.phoneNumber.length !== 11) {
            wx.showToast({ title: '手机号长度有误', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (that.data.qqId.length > 0) {
            if (!checkQQ(that.data.qqId)) {
                wx.showToast({ title: '请输入正确的QQ号', icon: 'none', image: '', duration: 1000 });
                return false;
            }
        }
        that.joinShareUser();
    },
    async joinShareUser() {
        try {
            const { phoneNumber, wechatId, qqId } = this.data;
            const data = await api.hei.joinShareUser({
                phone: phoneNumber,
                wechat: wechatId,
                qq: qqId
            });
            await showToast({
                title: '提交成功,请等待商家审核',
                icon: 'none'
            });
            setTimeout(() => {
                wx.switchTab({
                    url: '/pages/me/me'
                });
            }, 1000);
        } catch (e) {
            await showToast({
                title: '申请失败',
                icon: 'none'
            });
        }
        this.setData({
            isShowModal: false
        });
    },

    applyModal() {
        this.setData({
            isShowModal: true
        });
    },
    closeModal() {
        this.setData({
            isShowModal: false
        });
    },

    async redirectToHome() {
        const { affiliate_enable, is_affiliate_member } = this.data;
        if (!affiliate_enable) {
            const { confirm }  = await showModal({
                title: '温馨提示',
                content: '商家暂时关闭了分销功能',
                showCancel: false
            });
            if (confirm) {
                wx.redirectTo({ url: '/pages/home/home' });
            }
        } else if (is_affiliate_member) {
            const { confirm }  = await showModal({
                title: '温馨提示',
                content: '您已经是分销员,请前往分销中心',
                showCancel: false
            });
            if (confirm) {
                wx.redirectTo({ url: '/pages/share/shareCenter/shareCenter' });
            }
        }
    }
});
