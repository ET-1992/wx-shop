import getRemainTime from 'utils/getRemainTime';
Component({
    properties: {
        product: {
            type: Object,
            value: {},
        },
        miaosha: {
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
        productLayoutStyle: {
            type: String,
            value: '',
        },
        tplStyle: {
            type: String,
            value: '',
        },
        nextCursor: {
            type: Number,
            value: 0,
        },
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
    }
});
