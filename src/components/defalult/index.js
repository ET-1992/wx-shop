
import api from 'utils/api';

const app = getApp();

Component({
    properties: {
        title: {
            type: String,
            value: 'Component',
        },
    },

    methods: {
        onClick(ev) {
            console.log(ev.detail.value);
        },
    }
});
