import  templateTypeText from 'constants/templateType';
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
    data: {
        templateTypeText,
        defineTypeGlobal: app.globalData.defineTypeGlobal,
        selfAddress: app.vip && app.vip.self_address
    }
});

