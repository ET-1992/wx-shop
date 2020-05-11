Component({
    properties: {
        ordersComponentData: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ...newValue
                });
            }
        },
        themeColor: {
            type: Object,
            value: {}
        }
    }
});