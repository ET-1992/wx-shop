import getRemainTime from 'utils/getRemainTime';

const app = getApp();

Component({
    properties: {
        isList: {
            type: Boolean,
            value: false,
            observer(newVal) {
                if (!newVal) { return }
                this.data.isList = newVal;
            }
        },
        product: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { miaosha_end_timestamp, miaosha_start_timestamp } = newVal;
                const now = Math.round(Date.now() / 1000);
                let timeLimit = miaosha_end_timestamp - now;
                let hasStart = true;
                let hasEnd = false;
                if (now < miaosha_start_timestamp) {
                    hasStart = false;
                    timeLimit = miaosha_start_timestamp - now;
                }

                if (now > miaosha_end_timestamp) {
                    hasEnd = true;
                    timeLimit = 0;
                }
                this.setData({
                    timeLimit,
                    hasStart,
                    hasEnd
                });

                if (timeLimit && !this.intervalId) {
                    const intervalId = setInterval(() => {
                        const { timeLimit } = this.data;
                        const [hour, minute, second] = getRemainTime(timeLimit);
                        let day = parseInt(hour / 24, 10);
                        if (timeLimit - 1 <= 0) {
                            this.setData({
                                hasEnd: true,
                                hasStart: true
                            });
                            return;
                        }
                        this.setData({
                            'timeLimit': timeLimit - 1,
                            remainTime: {
                                day: day,
                                hour: hour - day * 24,
                                minute,
                                second,
                            }
                        });

                    }, 1000);
                    this.intervalId = intervalId;
                }
            },
        }
    },

    data: {
        remainTime: {
            hour: '00',
            minute: '00',
            second: '00',
        },
        hasStart: true,
        hasEnd: false,
        timeLimit: 0,
    },

    attached() {
        const { themeColor } = app.globalData;
        this.setData({ themeColor });
    },

    detached() {
        clearInterval(this.intervalId);
    },

    methods: {
        onClick() {
            const { isList, product: { id }} = this.data;
            if (isList) {
                wx.navigateTo({
                    url: `/pages/productDetail/productDetail?id=${id}`
                });
            }
            else {
                wx.navigateTo({
                    url: `/pages/miaoshaList/miaoshaList?id=${id}`
                });
            }
        },
    }
});
