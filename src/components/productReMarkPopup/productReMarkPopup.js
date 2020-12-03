Component({
    properties: {
        form: {
            type: Object,
            value: {},
        },
        show: {
            type: Boolean,
            value: false,
        }
    },
    methods: {
        // 关闭商品留言
        onCloseRemark() {
            this.triggerEvent('close');
        },
    }
});

