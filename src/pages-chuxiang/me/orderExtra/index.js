import { go } from 'utils/util';
Component({
    properties: {
        ordersComponentData: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ...newValue
                });
            }
        }
    },
    data: {
        show: false
    },
    methods: {
        go,

        /* 分享店铺 */
        /* 调起底部弹窗 */
        async openShareModal() {
            let { show } = this.data;
            this.setData({
                show: !show
            });
        },

        /* 关闭底部弹窗 */
        onClose() {
            let { show } = this.data;
            this.setData({
                show: !show
            });
        },

        /* 关闭底部弹窗 */
        closeShareModal() {
            let { show } = this.data;
            this.setData({
                show: !show
            });
        }
    }
});