Component({
    properties: {
        ordersComponentData: {
            type: Object,
            value: {},
        },
        themeColor: {
            type: Object,
            value: {}
        }
    },
    observers: {
        'ordersComponentData': function(value) {
            if (!value) { return }
            let { order_counts, order_icons } = value;
            this.setData({
                order_counts,
                order_icons,
            });
        }
    }
});