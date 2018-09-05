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
        defineTypeGlobalText: {
            magua: {
                addAddress: '添加服务地址',
                receiver: '联系人',
                address: '服务地址'
            },
            default: {
                addAddress: '添加地址',
                receiver: '收货人',
                address: '收货地址'
            }
        }
    }
});

