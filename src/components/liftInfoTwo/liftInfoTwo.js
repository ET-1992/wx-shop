Component({
    properties: {
        title: {
            type: String,
            value: 'liftInfoTwo Component',
        },
        liftInfo: {
            type: Object,
            value: {},
            observer(newValue) {
                console.log('newValue', newValue);
            }
        },
        homeDeliveryTimes: {
            type: Array,
            value: []
        },
        isShowBorder: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        updateLiftInfoName(e) {
            const { value } = e.detail;
            console.log(value);
            this.triggerEvent('updateLiftInfo', { receiver_name: value }, { bubbles: true });
        },
        updateLiftInfoPhone(e) {
            const { value } = e.detail;
            this.triggerEvent('updateLiftInfo', { receiver_phone: value }, { bubbles: true });
        }
    }
});

