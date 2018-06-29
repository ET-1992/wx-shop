
import api from 'utils/api';

const app = getApp();

Component({
    properties: {
        categories: {
            type: Array,
            value: [],
        },
        categoryListStyle: {
            type: String,
            value: ''
        }
    },

    methods: {
        onClick(ev) {
            console.log(ev.detail.value);
        },
    }
});
