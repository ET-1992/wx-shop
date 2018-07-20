import api from 'utils/api';

Page({
    data: {
        title: 'shareList',
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    async onShow() {
        try {
            const data = await api.hei.getShareOrderList();
        } catch (e) {
            console.log(e, 'e');
        }

        const customerList = await api.hei.getShareCustomerList({
            user_type: 2
        });
        // console.log(data, data1, data2);
    }
});
