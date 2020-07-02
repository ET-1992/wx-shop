Component({
    properties: {
        goldData: {
            type: Object,
            value: {},
        },  // 组件对外属性
    },
    data: {
        gold: {
            type: Object,
            value: {},
        },  // 金价数据
        setting: {
            type: Object,
            value: {},
        },  // 模块配置
    },
    observers: {
        'goldData': function(prop) {
            let { content: gold, setting } = prop;
            this.setData({
                gold,
                setting,
            });
        }
    }
});

