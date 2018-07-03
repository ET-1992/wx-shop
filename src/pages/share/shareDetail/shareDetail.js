import { getNodeInfo } from 'utils/util';

Page({
    data: {
        title: 'shareMoney',
        isActive: 1,
        modal: {}
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
    },

    applyGetMoney() {
        this.setData({
            modal: {
                title: '提现',
                body: '提现前请先到分享中心完善个人资料',
                isShowModal: true
            }
        });
    }
});
