import { CONFIG } from 'constants/index';

Component({
    properties: {
        title: {
            type: String,
            value: 'addressTwo Component',
        },
        address: {
            type: Object,
            value: {},
        },
        isOrderDetail: {
            type: Boolean,
            value: false
        }
    }
});

