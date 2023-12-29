import { CONFIG } from 'constants/index';
import { autoNavigate_ } from 'utils/util';
import wxProxy from 'utils/wxProxy';

Component({
    properties: {
        showBgColor: {
            type: Boolean,
            value: false
        },
        background: {
            type: String,
            value: '255, 255, 255'
        },
        color: {
            type: String,
            value: 'rgba(0, 0, 0, 1)'
        },
    },
    data: {
        isShowMenu: false,  // 是否展示菜单栏列表
        workContact: false,  // 是否为企业微信客服
        menuList: [
            { icon: 'wap-home-o', text: '返回首页', handle: 'goHome' },
            { icon: 'shopping-cart-o', text: '购物车', handle: 'goCart' },
            { icon: 'star-o', text: '联系客服', handle: 'findHelp' },
            // { icon: 'search', text: '搜索商品', handle: 'goSearch' },
        ],
        config: {},
        showContact: false,  // 是否展示企业微信弹窗
    },
    lifetimes: {
        attached() {
            const config = wx.getStorageSync(CONFIG);

            let workContact = config.contact && config.contact.type === 'work_weixin';
            this.setData({ workContact, config });
        }
    },
    methods: {
        // 左上角返回
        async handlerGoback() {
            try {
                await wxProxy.navigateBack();
            } catch (e) {
                let url = '/pages/home/home';
                autoNavigate_({ url });
            }
        },

        // 左上角菜单
        handlerShowMenu() {
            let { isShowMenu } = this.data;
            this.setData({ isShowMenu: !isShowMenu });
        },

        // 点击菜单功能
        handleMenuItem(e) {
            let { method } = e.currentTarget.dataset;
            const { config } = this.data;
            if (method === 'goHome') {
                let url = '/pages/home/home';
                autoNavigate_({ url });
            } else if (method === 'goCart') {
                let url = '/pages/cart/cart';
                autoNavigate_({ url });
            } else if (method === 'findHelp') {
                if (config.contact && config.contact.type === 'work_weixin') {
                    let showContact = true;
                    this.setData({
                        showContact,
                    });
                } else {
                    const { corp_id: corpId, url } = config.contact;
                    wx.openCustomerServiceChat({
                        extInfo: { url },
                        corpId
                    });
                }
            } else if (method === 'goSearch') {
                let url = '/pages/search/search';
                autoNavigate_({ url });
            }
        },
    },

});

