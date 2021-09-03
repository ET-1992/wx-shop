Component({
    properties: {
        content: {
            type: Object,
            value: {},
        }
    },
    methods: {
        onClose() {
            this.triggerEvent('onClose');
        }
    }
});

