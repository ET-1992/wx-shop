import { CONFIG } from 'constants/index';
import api from 'utils/api';
import behaviorSku from 'utils/behavior/behaviorSku';
import proxy from 'utils/wxProxy';
import { updateTabbar } from 'utils/util';

const app = getApp();

Component({
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },
    behaviors: [behaviorSku],
    properties: {
        quantity: {
            type: Number,
            value: 1,
        },
        // 是否携带底部栏
        hasBottom: {
            type: Boolean,
            value: false,
        },
        // 标题是否居中
        titleCenter: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        themeColor: {},
    },
    observers: {
    },
    lifetimes: {
        async attached() {
            let { themeColor } = app.globalData;
            let config = wx.getStorageSync(CONFIG);
            if (!config) {
                let data = await api.hei.config();
                ({ config } = data);
            }
            this.setData({ config, themeColor });
        },
    },

    methods: {
        // 运行预下单
        async onQuickCreate(actions) {
            try {
                this.onFormConfirm();
                let component = this.selectComponent('#mark-form');
                console.log('component', component);
                if (component) {
                    let form = component.handleValidate();
                    this._remarks = form;
                }
                this.getCurrentOrder();
                let index = actions.findIndex(item => item.type === 'onBuy');
                if (index > -1) {
                    this.runOrderPrepare();
                } else {
                    this.runAddCart();
                }
            } catch (e) {
                console.log('resolved error', e);
            }
        },

        // 运行预下单
        runOrderPrepare() {
            let { _shipping_type, _currentOrder } = this;
            getApp().globalData.currentOrder = _currentOrder;
            this._currentOrder = {};
            let url = `/pages/orderCreate/orderCreate?shipping_type=${_shipping_type}`;
            wx.navigateTo({ url });
        },

        // 加入购物车 组件方法
        async onAddCart() {
            let actions = [{ type: 'addCart' }];
            this.onQuickCreate(actions);
        },

        // 进行加车操作
        async runAddCart() {
            let { _currentOrder } = this;
            let posts = JSON.stringify(_currentOrder.items);
            try {
                let data = await api.hei.addCart({ posts });
                let { count } = data;
                wx.showToast({ title: '成功添加' });
                wx.setStorageSync('CART_NUM', count);
                updateTabbar({ tabbarStyleDisable: true });
                this.triggerEvent('add-cart', data);
            } catch (e) {
                wx.showModal({
                    title: '温馨提示',
                    content: e.errMsg,
                    showCancel: false,
                });
            } finally {
                this._currentOrder = {};
            }
        },
        updateQuantity({ detail }) {
            const { value } = detail;
            this.setData({ quantity: value });
        },
    },
});
