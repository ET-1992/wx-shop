Component({
    properties: {
        textList: {
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
        userInfo: {
            type: Object,
            value: {}
        }
    },
    methods: {
        showContactModal(e) {
            this.triggerEvent('showContactModal', e, {
                bubbles: true
            });
        }
    }
});

