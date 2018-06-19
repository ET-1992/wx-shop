Component({
    properties: {
        title: {
            type: String,
            value: '',
        },
        content: {
            type: String,
            value: '',
        },
        iconType: {
            type: String,
            value: 'success',
        },
        iconUrl: {
            type: String,
            value: '',
        },
        showCancel: {
            type: Boolean,
            value: true,
        },
        cancelText: {
            type: String,
            value: '取消',
        },
        confirmText: {
            type: String,
            value: '确定',
        },
        cancelColor: {
            type: String,
            value: '#999',
        },
        confirmColor: {
            type: String,
            value: '#000',
        },
        confirmButtonType: {
            type: String,
            value: 'default',
        },
        isShow: {
            type: Boolean,
            value: false,
        },
    },
    methods: {
        onConfirm() {
            this.setData({ isShow: false });
            const { confirmButtonType } = this.data;
            if (confirmButtonType === 'default') {
                this.triggerEvent('modalConfirm');
            }
        },
        onCancel() {
            this.setData({ isShow: false });
        },
        onMockCancel() {
            this.setData({ isShow: false });
        },
    },
});

