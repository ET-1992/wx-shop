import  templateTypeText from 'constants/templateType';
const WxParse = require('utils/wxParse/wxParse.js');
const app = getApp();
Component({
    properties: {
        product: {
            type: Object,
            value: {}
        }
    },
    data: {
        templateTypeText
    },
    attached() {
        const { defineTypeGlobal } = app.globalData;

        WxParse.wxParse(
            'contentList',
            'html',
            this.data.product.content,
            this,
        );

        this.setData({ defineTypeGlobal });
    }
});