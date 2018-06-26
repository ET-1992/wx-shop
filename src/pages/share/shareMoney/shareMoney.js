import { getNodeInfo } from 'utils/util';

Page({
    data: {
        title: 'shareMoney',
        isActive: 1
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    checkActive(e) {
        console.log(e);
        const { index } = e.currentTarget.dataset;
        console.log(index);
        this.setData({
            isActive: index
        }, () => {
            console.log(this.data);
        });
    }
});
