
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
    attached() {
        const { tabbarPages } = app.globalData;
        this.setData({
            tabbarPages
        });
    },
    methods: {
        onClick(ev) {
            console.log(ev.detail.value);
        },
    }
});
