
import api from 'utils/api';
Page({
    data: {

    },

    async onLoad(params) {
        const { serial_no } = params;
        const result = await this.getLotteryResults(serial_no);
        this.setData({
            result
        });
    },
    async getLotteryResults(serial_no) {
        const { seeds, batch, sum, remainder } = await api.hei.fetchLuckydrawResult({ serial_no });
        let result = {
            seeds,
            batch,
            sum,
            remainder
        };
        return result;
    }
});
