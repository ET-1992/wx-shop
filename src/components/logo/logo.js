import { go } from 'utils/util';
import { CONFIG } from 'constants/index';

Component({
    properties: {
        logoObj: {
            type: Object,
            value: {},
        }
    },
    methods: {
        go
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            config
        });
    }
});

