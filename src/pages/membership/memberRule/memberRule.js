import api from 'utils/api';
Page({
    data: {
        title: 'memberRule',
        imgUrl: ''
    },

    onLoad() {
        this.getMemberRule();
    },

    async getMemberRule() {
        const ruleData = await api.hei.getShopRule({
            key: 'membership'
        });
        if (ruleData.errcode === 0) {
            this.setData({
                imgUrl: ruleData.image_url
            });
        }
    }
});