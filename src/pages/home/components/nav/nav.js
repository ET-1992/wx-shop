const app = getApp();

Component({
    properties: {
        nav: {
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
        }
    },

    attached() {
        const { tabbarPages } = app.globalData;
        this.setData({ tabbarPages });
    },

    methods: {
        showContactModal(e) {
            this.triggerEvent('showContactModal', e, { bubbles: true });
        }
    }
});