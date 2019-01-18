import  templateTypeText from 'constants/templateType';
import { CONFIG } from 'constants/index';

const app = getApp();

Component({
    properties: {
        address: {
            type: Object,
            value: {},
        },
        defineTypeGlobal: {
            type: String,
            value: ''
        }
    },
    created() {
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            selfAddress: config && config.self_address
        });
    },
    data: {
        templateTypeText,
        defineTypeGlobal: app.globalData.defineTypeGlobal
    }
});

