import { ORDERINFO } from 'constants/index';

Component({
    properties: {
        title: {
            type: String,
            value: 'OrderInfoPanel Component',
        },
        order: {
            type: {}
        }
    },

    data: {
        info: ORDERINFO,  // 自定义表单标题和字段
    },

});

