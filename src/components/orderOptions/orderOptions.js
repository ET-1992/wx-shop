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
        // 创建预下单数据
        async onQuickCreate(actions) {
            try {
                this.onFormConfirm();
                this.handleOrderCreate();
                let { _shipping_type, _currentOrder } = this;
                let index = actions.findIndex(item => item.type === 'onBuy');
                if (index > -1) {
                    app.globalData.currentOrder = _currentOrder;
                    let url = `/pages/orderCreate/orderCreate?shipping_type=${_shipping_type}`;
                    wx.navigateTo({ url });
                } else {
                    // 加车
                    let posts = JSON.stringify(_currentOrder.items);
                    let data = await api.hei.addCart({ posts });
                    if (!data.errcode) {
                        let { count } = data;
                        wx.showToast({ title: '成功添加' });
                        wx.setStorageSync('CART_NUM', count);
                        updateTabbar({ tabbarStyleDisable: true });
                        return data;
                    }
                }
            } catch (e) {
                console.log('resolved error', e);
            }
        },

        // 加入购物车
        async onAddCart() {
            let actions = [{ type: 'addCart' }];
            let data = await this.onQuickCreate(actions);
            this.triggerEvent('add-cart', data);
        },
    },
});
