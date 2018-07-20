import api from 'utils/api';
import { getUserInfo, getAgainUserForInvalid, updateCart, auth  } from 'utils/util';
import { chooseAddress, getSetting, authorize } from 'utils/wxp';
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
        consoleTime: 0,

        isShowConsole: false
    },

    async loadOrderCount() {
        // const data = await api.hei.fetchOrderCount({
        //     status: '1,2,3,10',
        // });
        const data = await api.hei.myFare();

        this.setData({
            ...data
        });

        console.log(this.data);
    },

    onLoad() {
        app.log('页面onLoad');
        // user用户客服对接
        const { themeColor } = app.globalData;
        this.setData({ themeColor, isShowConsole: app.openConsole });
    },

    async onShow() {
        app.log('页面onShow');
        const user = getUserInfo();
        this.setData({ user, isShowConsole: app.openConsole });
        this.loadOrderCount();

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
        const res = await auth({
            scope: 'scope.address',
            ctx: this
        });
        if (res) {
            const addressRes = await chooseAddress();
            wx.setStorageSync(ADDRESS_KEY, addressRes);
        }
    },

    async bindGetUserInfo(e) {
        const { encryptedData, iv } = e.detail;
        const user = await getAgainUserForInvalid({ encryptedData, iv });
        this.setData({
            user
        });
    },

    consoleOpen() {
        this.data.consoleTime++;
        console.log(this.data.consoleTime);
        setTimeout(() => {
            this.data.consoleTime = 0;
        }, 1000);

        if (this.data.consoleTime >= 7) {
            console.log('six six six');
            app.openConsole = true;
            app.event.emit('showConsole');
            this.onLoad();
        }

        if (app.openConsole) {
            this.data.openConsoleResDataTime++;
            setTimeout(() => {
                this.data.openConsoleResDataTime = 0;
            }, 1000);
            if (this.data.openConsoleResDataTime >= 3) {
                console.log('openConsoleResData');
                app.openConsoleResData = true;
            }
        }
    }
});
