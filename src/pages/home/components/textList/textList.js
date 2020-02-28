Component({
    properties: {
        title: {
            type: String,
            value: 'textList Component',
        },
        switchData: {
            type: Boolean,
            value: false,
        },
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
        }
    },
});

