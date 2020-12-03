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
        'form': function(value) {
            if (!value) { return }
            // console.log('value', value);
            let simpleForm = value.filter(item => item.value);
            this.setData({ simpleForm });
        }
    },
    data: {
        simpleForm: [],
    },
    methods: {
        // 关闭商品留言
        onCloseRemark() {
            this.triggerEvent('close');
        },
    }
});

