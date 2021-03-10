const app = getApp();
Component({
    properties: {
        textMessage: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title, type, id } = newVal;
                this.setData({
                    content,
                    setting,
                    title,
                    type,
                    id
                });
            }
        },

        size: {
            type: Number,
            value: 11
        },
        second: {
            type: Number,
            value: 0
        },
        userInfo: {
            type: Object,
            value: {}
        }
    },
    attached() {
        const { tabbarPages } = app.globalData;
        this.setData({
            tabbarPages
        });
    },
    methods: {
        showContactModal(e) {
            this.triggerEvent('showContactModal', e, {
                bubbles: true
            });
        }
    }
});