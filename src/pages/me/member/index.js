Component({
    properties: {
        user: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ...newValue
                });
            }
        }
    }
});