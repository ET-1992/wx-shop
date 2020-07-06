const app = getApp();
Component({
    properties: {
        title: {
            type: String,
            value: '参数',
        },
        product: {
            type: Object,
            value: {}
        },
        type: {
            type: String,
            value: 'default'
        },
        isIphoneX: {
            type: Boolean,
            value: true
        },
        color: {
            type: String,
            value: ''
        }
    },
    data: {
        global_Data: {},
        isShowProductParam: false,
        paramKeys: ''
    },
    attached() {
        this.setData({
            global_Data: app.globalData
        });
        const { product } = this.data;
        if (product.attributes) {
            const { attributes } = product;
            this.getAllParamKey(attributes);
        }
    },
    methods: {
        /* 打开遮罩层 */
        showParamModal() {
            let animation = wx.createAnimation({
                duration: 400,
                timingFunction: 'ease',
                delay: 0
            });
            this.animation = animation;
            animation.translateY(700).step();
            this.setData({
                animationData: animation.export(),
                isShowProductParam: true
            });
            setTimeout(() => {
                animation.translateY(0).step();
                this.setData({
                    animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
                });
            }, 200);
        },
        hideParamModal() {
            let animation = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease',
                delay: 0
            });
            this.animation = animation;
            animation.translateY(700).step();
            this.setData({
                animationData: animation.export(),
            });
            setTimeout(function () {
                animation.translateY(0).step();
                this.setData({
                    animationData: animation.export(),
                    isShowProductParam: false
                });
            }.bind(this), 300);
        },
        /* 关闭遮罩层 */
        // 获得产品参数的所有标题
        getAllParamKey(params) {
            let keys = params.map((item) => {
                return item.key;
            });
            let paramKeys = keys.join(' ');
            this.setData({
                paramKeys
            });
        },
        catchMove() {
            return;
        }
    }
});