Component({
    properties: {
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
            }
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
            value: 's'
        }
    },

    data: {
        hasStart: true,
        hasEnd: false
    }
});