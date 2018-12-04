import getRemainTime from 'utils/getRemainTime';
Component({
    properties: {
        time: {
            type: String,
            value: '',
            observer(newVal) {
                if (!newVal) { return }
                const remainSecond = newVal;
                this.setData({
                    remainSecond,
                    remainTime: getRemainTime(remainSecond).join(':')
                });
                if (remainSecond) {
                    this.intervalId = setInterval(() => {
                        const { remainSecond } = this.data;
                        this.setData({
                            remainSecond: remainSecond - 1,
                            remainTime: getRemainTime(remainSecond - 1).join(':')
                        });
                    }, 1000);
                }
            }
        },
    },
    detached() {
        clearInterval(this.intervalId);
    },
    pageLifetimes: {
        hide() {
            clearInterval(this.intervalId);
        }
    }
});