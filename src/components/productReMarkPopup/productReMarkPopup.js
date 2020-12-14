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
    observers: {
        // 查看表单数据是否为空
        'form': function(value) {
            if (!value) { return }
            let hsaFormShow = value.some(item => item.value);
            this.setData({ hsaFormShow });
        }
    },
    data: {
        hsaFormShow: true,
    },
    methods: {
        // 关闭商品留言
        onCloseRemark() {
            this.triggerEvent('close');
        },
    }
});

