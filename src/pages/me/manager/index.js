Component({
    properties: {
        showModal: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        closeModal() {
            this.setData({
                showModal: false
            });
        }
    }
});

