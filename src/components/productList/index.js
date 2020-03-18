import getRemainTime from 'utils/getRemainTime';
const app = getApp();

Component({
    properties: {
        product: {
            type: Object,
            value: {},
        },
        article: {
            type: Object,
            value: {},
        },
        miaosha: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }

                // 兼容秒杀倒计时
                let { miaosha_end_timestamp, miaosha_start_timestamp } = newVal;
                if (!miaosha_end_timestamp || !miaosha_start_timestamp) {
                    const { seckill_end_timestamp, seckill_start_timestamp } = newVal;
                    miaosha_end_timestamp = seckill_end_timestamp;
                    miaosha_start_timestamp = seckill_start_timestamp;
                }

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
            }
        },

        themeColor: {
            type: Object,
            value: {},
        },
        modules: {
            type: Object,
            value: {},
        },
        module: {
            type: Object,
            value: {},
        },
        productLayoutStyle: {
            type: String,
            value: '',
        },
        tplStyle: {
            type: String,
            value: 'default',
        },
        nextCursor: {
            type: Number,
            value: 0,
        },
        // 商品促销类型
        type: {
            type: String,
            value: 'miaosha'
        },
        // 会员专属商品的市场价
        marketPrice: {
            type: Boolean,
            value: false
        },
        // 砍价列表 专属
        hasBorder: {
            type: Boolean,
            value: false
        }
    },
    data: {
        nowTS: Date.now() / 1000,
        remainTime: {
            hour: '00',
            minute: '00',
            second: '00',
        },
        hasStart: true,
        hasEnd: false,
        timeLimit: 0,
        globalData: app.globalData
    },

    detached() {
        clearInterval(this.intervalId);
    },
    // pageLifetimes: {
    //     hide() {
    //         clearInterval(this.intervalId);
    //     }
    // }
});
