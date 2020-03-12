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

    methods: {
        showContactModal(e) {
            this.triggerEvent('showContactModal', e, { bubbles: true });
        }
    }
});