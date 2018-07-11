import api from 'utils/api';
import { getUserInfo, getAgainUserForInvalid, updateCart  } from 'utils/util';
import { chooseAddress, getSetting } from 'utils/wxp';
import { ADDRESS_KEY } from 'constants/index';
const app = getApp();

// const itemActions = {
//     coupon: () => console.log('coupon'),
//     notice: () => console.log('notice'),
// };

// 创建页面实例对象
Page({

    // 页面的初始数据
    data: {
        // active: 0,
        user: {},
        orderCount: {
            1: 0,
            2: 0,
            3: 0,
            10: 0,
        },
    },

    async loadOrderCount() {
        // const data = await api.hei.fetchOrderCount({
        //     status: '1,2,3,10',
        // });
        const data = await api.hei.myFare();

        this.setData({
            orderCount: data.order_counts,
            coupons: data.coupons,
            wallet: data.wallet
        });

        console.log(this.data);
    },

    onLoad() {
        // user用户客服对接
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
    },

    async onShow() {
        const user = getUserInfo();
        this.setData({ user });
        this.loadOrderCount();

        const setting = await getSetting();
        console.log(setting);
        if (setting.authSetting['scope.address']) {
            this.setData({
                refuseAddress: false,
                addressModal: {
                    isFatherControl: false,
                },
            });
        }

        const { categoryIndex } = app.globalData;
        updateCart(categoryIndex.categoryIndex);
    },

    onLogin() {
        wx.navigateTo({ url: '/pages/login/login' });
    },
    // free() {
    // 	this.setData({
    // 		active: 1,
    // 	});
    // },
    // close() {
    // 	this.setData({
    // 		active: 0,
    // 	});
    // },
    // onItemClick(ev) {
    //     const { name } = ev.currentTarget.dataset;
    //     const action = itemActions[name];
    //     action();
    // },

    async onAddress() {
        try {
            const address = await chooseAddress();
            wx.setStorageSync(ADDRESS_KEY, address);
            this.setData({
                address,
                refuseAddress: false
            });

        } catch (err) {
            console.log(err.errMsg);
            // const addressStorage = wx.getStorageSync(ADDRESS_KEY);
            const setting = await getSetting();
            console.log(setting);
            if (!setting.authSetting['scope.address']) {
                this.setData({
                    refuseAddress: true
                }, () => {
                    this.onModal();
                });
            }
        }
    },
    onModal() {
        this.setData({
            addressModal: {
                isFatherControl: true,
                title: '温馨提示',
                isShowModal: true,
                body: '请授权地址信息',
                type: 'button',
                buttonData: {
                    opentype: 'openSetting'
                }
            },
        });
    },
    onAddressCancel() {
        this.setData({
            'addressModal.isShowModal': false,
            isShouldRedirect: false
        });
    },

    onAddressConfirm() {
        this.setData({
            'addressModal.isShowModal': false,
            isShouldRedirect: true
        });
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        this.setData({
            user
        });
    }
});
