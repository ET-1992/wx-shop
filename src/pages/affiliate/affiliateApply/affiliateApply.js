import api from 'utils/api';
import { checkPhone, checkQQ, getAgainUserForInvalid, autoNavigate, go } from 'utils/util';
import { CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';

const app = getApp();
Page({
    data: {
        title: 'affiliateApply',
        image_url: '',
        is_affiliate_member: false,
        affiliate_enable: false,
        isShowModal: false,
        showBtn: false,
        wechatId: '',   // 微信号
        qqId: '',   // qq号
        phoneNumber: '',    // 手机号
        checked: false
    },

    go,

    onLoad(parmas) {
        const { themeColor } = app.globalData;
        console.log(parmas);
        this.setData({
            isIphoneX: app.systemInfo.isIphoneX,
            themeColor
        });
    },

    async onShow() {
        this.setData({
            isLoading: true
        });
        const config = wx.getStorageSync(CONFIG);
        const data = await api.hei.getWelcomeShare();
        console.log(data);
        this.setData({
            config,
            ...data,
            isLoading: false
        }, this.redirectToHome);
        wx.setNavigationBarTitle({
            title: `${config.affiliate_name}`
        });
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
        } else if (!that.data.wechatId) {
            wx.showToast({ title: '微信号不能为空', icon: 'none', image: '', duration: 1000 });
            return false;
        } else if (!that.data.checked) {
            wx.showToast({ title: '请阅读并同意《用户服务协议》与《隐私政策》', icon: 'none', image: '', duration: 1000 });
            return false;
        }
        that.joinShareUser();
    },
    async submitFormId(ev) {
        // await api.hei.submitFormId({
        //     form_id: ev.detail.formId,
        // });
        this.setData({
            form_id: ev.detail.formId
        });
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        if (user) {
            if (this.data.member_need_audit) {
                this.applyModal();
            } else {
                this.beShareUser();
            }
        }
    },

    async joinShareUser() {
        this.setData({
            isShowModal: false
        });
        try {
            const { phoneNumber, wechatId, qqId, form_id } = this.data;
            const data = await api.hei.joinShareUser({
                phone: phoneNumber,
                wechat: wechatId,
                qq: qqId,
                form_id,
                code: app.globalData.afcode || ''
            });
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '提交成功，请等待商户审核通过',
                showCancel: false,
                mask: true
            });
            if (confirm) {
                autoNavigate('/pages/me/me');
            }
        } catch (e) {
            wx.showToast({
                title: '提交失败',
                icon: 'none'
            });
        }
    },

    /* 免后台审核成为分享家 */
    async beShareUser() {
        try {
            const data = await api.hei.joinShareUser({
                code: app.globalData.afcode || ''
            });
            const { confirm }  = await proxy.showModal({
                title: '温馨提示',
                content: '申请成功，您已成为分享家',
                showCancel: false,
                mask: true
            });
            if (confirm) {
                autoNavigate('/pages/affiliate/affiliateCenter/affiliateCenter');
            }
        } catch (e) {
            wx.showToast({
                title: '申请失败',
                icon: 'none'
            });
        }
    },

    /* 申请弹窗 */
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
        const { affiliate_enable, is_affiliate_member, audit_status = '' } = this.data;
        if (!affiliate_enable) {
            const { confirm }  = await proxy.showModal({
                title: '温馨提示',
                content: '商家暂时关闭了分享功能',
                showCancel: false,
                mask: true
            });
            if (confirm) {
                autoNavigate('/pages/home/home');
            }
        }
        if (affiliate_enable && is_affiliate_member && audit_status === '1') {
            const { confirm }  = await proxy.showModal({
                title: '温馨提示',
                content: '审核中，请等待商户审核通过',
                showCancel: false,
                mask: true
            });
            if (confirm) {
                autoNavigate('/pages/home/home');
            }
        }
        if (affiliate_enable && is_affiliate_member && audit_status === '2') {
            const { confirm }  = await proxy.showModal({
                title: '温馨提示',
                content: '您已经是分享家，请前往分享中心',
                showCancel: false,
                mask: true
            });
            if (confirm) {
                autoNavigate('/pages/affiliate/affiliateCenter/affiliateCenter');
            }
        }
    },

    async getPhoneNumber(e) {
        const data = await api.hei.getUserPhoneNumber({
            iv: e.detail.iv,
            encrypted_data: e.detail.encryptedData
        });
        console.log('data', data);
        this.setData({ phoneNumber: data.phone });
    },

    onChange(event) {
        this.setData({
            checked: event.detail
        });
        console.log('checked', this.data.checked);
    }
});
