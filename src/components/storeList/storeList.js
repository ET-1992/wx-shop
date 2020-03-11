
Component({
    properties: {
        title: {
            type: String,
            value: 'storeList Component',
        },
        addresses: {
            type: Object,
            value: {},
            observer(newValue) {
                console.log('newValue12', newValue);
            }
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        },
        homeDeliveryTimes: {
            type: Array,
            value: [],
            observer(newValue) {
                console.log('newValue15', newValue);
            }
        },
        address: { // 确认订单数据
            type: Object,
            value: {},
        }
    },

    data: {
        index: 0
    },

    methods: {}
});

