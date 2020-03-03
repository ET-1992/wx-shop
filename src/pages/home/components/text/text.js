Component({
    properties: {
        text: {
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
        }
    }
});