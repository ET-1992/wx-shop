Component({
    properties: {
        module: {
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
        config: {
            type: Object,
            value: {}
        }
    },

    methods: {
        submitFormId() {
            this.triggerEvent('submitFormId', {}, {
                bubbles: true
            });
        }
    }
});