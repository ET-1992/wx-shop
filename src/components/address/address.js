import  templateTypeText from 'constants/templateType';
import { CONFIG } from 'constants/index';
import { autoTransformAddress } from 'utils/util';

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
    attached() {
        const config = wx.getStorageSync(CONFIG);
        console.log(config.self_address, 'selfAddress');
        this.setData({
            selfAddress: config && config.self_address
        });
    },
    data: {
        templateTypeText,
        defineTypeGlobal: app.globalData.defineTypeGlobal
    },
    methods: {
      async onChooseAddress(e) {
        console.log('0010', e);
        const res = await wx.chooseAddress();
        const address = autoTransformAddress(res);
        this.setData({
          address: res
        });
        console.log(address, res, '11res');
      }
    }
});

