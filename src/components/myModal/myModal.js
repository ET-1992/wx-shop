const app = getApp();

Component({
    properties: {
        modal: {
            type: Object,
            value: {},
            observer(newValue) {
                if (newValue) {
                    const { defineModal } = this.data;
                    this.setData({
                        defineModal: { ...defineModal, ...newValue }
                    }, () => {
                        console.log(this.data.defineModal);
                    });
                }
            }
        }
    },
    data: {
        defineModal: {
            title: '温馨提示', // 弹窗标题
            body: '', // 弹窗身体
            isShowCanel: true, // 是否有取消按钮
            type: 'button', // 按钮 button 或者 跳转 navigator
            navigateData: {}, // type = navigator 时生效
            buttonData: {}, // type = button 时生效
            confirmText: '确定',
            cancelText: '取消',
            isShowModal: false, // 控制弹窗展示
            isFatherControl: false // 是否由父组件控制
        }
    },
    methods: {
        onCancel() {
            console.log('console');
            if (this.data.defineModal.isFatherControl) {
                this.triggerEvent('onCancel', {}, { bubbles: true });
            } else {
                this.setData({
                    'defineModal.isShowModal': false
                });
            }
        },
        onConfirm() {
            if (this.data.defineModal.isFatherControl) {
                this.triggerEvent('onConfirm', {}, { bubbles: true });
            } else {
                this.setData({
                    'defineModal.isShowModal': false
                });
            }
        },
        touchmove() {
            console.log('点击穿透阻止');
            return;
        }
    }
});

