import { go } from 'utils/util';
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
        }
    },
    methods: {
        go
    }
});