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
    data: {
        templateTypeText,
        defineTypeGlobal: app.globalData.defineTypeGlobal
    }
});

