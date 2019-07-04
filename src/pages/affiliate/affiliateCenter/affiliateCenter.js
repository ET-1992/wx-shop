import api from 'utils/api';
import { go } from 'utils/util';
const app = getApp();

Page({
    data: {
        title: 'affiliateCenter',
        // isShowModal: false,
        isLoading: true,
        member: {},
        wallet: {},
        isShowPopup: false, // 是否开启编辑用户名弹窗
        value: '' // input框输入内容
    },

    go,

    onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
    },
    async onShow() {
        const data = await api.hei.shareUserInfo();
        const { member, wallet, affiliate_enable } = data;
        const user = data.current_user;
        console.log(data, 'data');
        console.log(user, 'user');
        this.setData({
            member,
            wallet,
            user,
            isLoading: false,
            affiliate_enable,
            globalData: app.globalData
        });
    },
    // changeModal() {
    //     this.setData({
    //         isShowModal: !this.data.isShowModal
    //     });
    // },
    // goToAffiliate(e) {
    //     console.log(e, '090');
    //     const { urldata } = e.currentTarget.dataset;
    //     let url = '';
    //     switch (urldata) {
    //         case 'affiliateMoney': {
    //             const { wallet, member } = this.data;
    //             url = `/pages/affiliate/affiliateMoney/affiliateMoney?balance=${wallet.affiliate_balance}&income_pending=${wallet.affiliate_income_pending}&code=${member.code}`;
    //             break;
    //         }
    //         case 'affiliateFinishUserInfo': {
    //             url = '/pages/affiliate/affiliateFinishUserInfo/affiliateFinishUserInfo';
    //             break;
    //         }
    //         case 'affiliateProductList': {
    //             url = '/pages/affiliate/affiliateProductList/affiliateProductList';
    //             break;
    //         }
    //         case 'affiliateDetail': {
    //             url = '/pages/affiliate/affiliateDetail/affiliateDetail';
    //             break;
    //         }
    //         case 'affiliatePoster': {
    //             const { postertype } = e.currentTarget.dataset;
    //             console.log(postertype, 'poser');
    //             url = '/pages/affiliate/affiliatePoster/affiliatePoster?postertype=' + postertype;
    //             break;
    //         }
    //         default:
    //             break;
    //     }
    //     wx.navigateTo({
    //         url
    //     });
    // },

    // 开启弹窗
    editUserName() {
        const { isShowPopup } = this.data;
        this.setData({ isShowPopup: !isShowPopup });
    },

    // 关闭弹窗
    onClose() {
        this.setData({ isShowPopup: false });
    },

    onChange(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
        const { value } = event.detail;
        this.setData({ value });
    },

    async onEditUserName() {
        const { value } = this.data;
        console.log('value', value);
        if (!value) return;
        try {
            const data = await api.hei.updateUserInfo({ share_name: value });
            console.log(data);
            const user = data.current_user;
            this.setData({ user });
            console.log('user', user);
            wx.showToast({
                title: '修改成功',
                icon: 'success',
            });
            this.setData({ isShowPopup: false });
        } catch (error) {
            console.log(error);
        }
    }
});
