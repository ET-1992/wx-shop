import getRemainTime from 'utils/getRemainTime';
import { go } from 'utils/util';

Component({
    properties: {
        product: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                let { luckydraw } = newVal;

                // 兼容秒杀时间戳
                let { expired_time } = luckydraw.activity;
                const now = Math.round(Date.now() / 1000);
                let timeLimit = expired_time - now;
                let { hasStart, hasEnd } = this.data;
                if (timeLimit > 0) {
                    hasStart = true;
                    hasEnd = false;
                } else {
                    hasStart = false;
                    hasEnd = true;
                    timeLimit = 0;
                }

                this.setData({
                    timeLimit,
                    hasStart,
                    hasEnd,
                    luckydraw
                });

                if (timeLimit && !this.intervalId) {
                    const intervalId = setInterval(() => {
                        const { timeLimit } = this.data;
                        const [hour, minute, second] = getRemainTime(timeLimit);
                        let day = parseInt(hour / 24, 10);
                        if (timeLimit < 0) {
                            clearInterval(this.intervalId);
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
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
        status: {
            type: String,
            value: 'm'
        },
        config: {
            type: Object,
            value: {}
        },
        isShowAddCart: { // 购物车为你推荐是否加车
            type: Boolean,
            value: true
        },
        isMasonry: {
            type: Boolean,
            value: false
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
        timeLimit: 0
    },

    methods: {
        singleAddCart(e) {
            console.log(e, 'eeeeeeeeee');
            const { product } = e.currentTarget.dataset;
            this.triggerEvent('singleAddCart', { product });
        },
        go
    },

    detached() {
        clearInterval(this.intervalId);
    },
});