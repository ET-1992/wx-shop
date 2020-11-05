import { CONFIG } from 'constants/index';
import { go } from 'utils/util';
const app = getApp();

Component({
    properties: {
        scrollTop: {
            type: Number,
            optionalTypes: [String],
            value: 0,
        },
        // 导航栏类型(目前只有homeNav和productNav两种)
        navType: {
            type: String,
            value: ''
        },
        // 导航栏背景色
        backgroundRgb: {
            type: String,
            value: '255,255,255'
        },
        // 是否显示搜索框
        showSearchBox: {
            type: Boolean,
            vaule: true
        },
        title: {
            type: String,
            value: ''
        },
        showBgColor: {
            type: Boolean,
            value: false
        },
    },
    data: {
        barLeftStyle: '',  // 导航栏左边样式类
        barCenterStyle: '',  // 导航栏中间样式类
        isShowMenu: false,  // 是否展示菜单栏列表
        isContactForOpenType: true,  // 是否为普通客服按钮
        menuList: [
            { icon: 'wap-home-o', text: '返回首页', handle: 'goHome' },
            { icon: 'shopping-cart-o', text: '购物车', handle: 'goCart' },
            { icon: 'star-o', text: '联系客服', handle: 'findHelp' },
        ],
    },
    lifetimes: {
        attached() {
            this.getConfigData();
            this.getChildComponent();
        },
    },
    pageLifetimes: {
        show() {
            this.setData({
                globalData: app.globalData
            });
        }
    },
    methods: {

        go,

        // 获取页面配置信息
        getConfigData() {
            const config = wx.getStorageSync(CONFIG);
            let workContact = config.contact && config.contact.type === 'work_weixin';
            const { themeColor } = app.globalData;
            this.setData({
                isContactForOpenType: !workContact,
                globalData: app.globalData,
                config,
                themeColor
            });
        },

        // 获取子组件数据
        getChildComponent() {
            const child = this.selectComponent('#navigationBar');
            let { capsulePosition } = child.data,
                { windowWidth } = getApp().globalSystemInfo;
            let rightDistance = windowWidth - capsulePosition.right;
            let navBarLeft = [
                `width:${capsulePosition.width}px`,
                `height:${capsulePosition.height}px`,
                `margin-left:${rightDistance}px`
            ].join(';');
            let barCenterStyle = `height:${capsulePosition.height}px`;
            this.setData({
                barLeftStyle: navBarLeft,
                barCenterStyle,
            });
        },

        // 将颜色哈希值转换成RGB
        getBackgroundRgb() {
            let { backgroundColor: color = '#729153' } = app.globalData.themeColor,
                rgb = '255,255,255';
            if (color.length === 7) {
                color = color.slice(1);
                let arr = [
                    parseInt(color.slice(0, 2), 16),
                    parseInt(color.slice(2, 4), 16),
                    parseInt(color.slice(4, 6), 16),
                ];
                rgb = arr.join(',');
            }
            this.setData({ backgroundRgb: rgb });
        },

        // 左上角返回
        handlerGoback() {
            wx.navigateBack();
        },

        // 左上角菜单
        handlerShowMenu() {
            let { isShowMenu } = this.data;
            this.setData({ isShowMenu: !isShowMenu });
        },

        // 点击菜单功能
        handleMenuItem(e) {
            let { method } = e.currentTarget.dataset;
            if (method === 'goHome') {
                let url = '/pages/home/home';
                wx.switchTab({ url });
            } else if (method === 'goCart') {
                let url = '/pages/cart/cart';
                wx.switchTab({ url });
            } else if (method === 'findHelp') {
                this.handlerShowMenu();
                this.triggerEvent('contact', {});
            }
        },
    }
});

