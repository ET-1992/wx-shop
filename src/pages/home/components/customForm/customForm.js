Component({
    properties: {
        form: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title } = newVal;
                console.log(newVal, '666666666666');
                this.setData({
                    content,
                    setting,
                    title
                });
            }
        }
    },
    methods: {
        submitFormData(e) {
            const { form } = e.detail;
            this.triggerEvent('submitFormData', { form });
        }
    }
});

