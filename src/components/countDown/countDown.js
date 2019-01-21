import getRemainTime from 'utils/getRemainTime';
const formatConfirmTime = (seconds) => {
    let remainSeconds = seconds;
    const day = Math.floor(remainSeconds / (24 * 60 * 60));
    remainSeconds = remainSeconds % (24 * 60 * 60);
    const hour = Math.floor(remainSeconds / (60 * 60));
    remainSeconds = remainSeconds % (60 * 60);
    const minute = Math.floor(remainSeconds / 60);
    const second = remainSeconds % 60;
    const unit = ['天', '时', '分', '秒'];
    const dateStr = [day, hour, minute, second].reduce((str, value, index) => {
        let dateStr = str;
        if (value) {
            dateStr = dateStr + value + unit[index];
        }
        return dateStr;
    }, '');
    return { remainTime: dateStr, remainSecond: seconds };
};
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
                if (Number(remainSecond)) {
                    this.intervalId = setInterval(() => {
                        const { remainSecond } = this.data;
                        this.setData({
                            remainSecond: remainSecond - 1,
                            remainTime: getRemainTime(remainSecond - 1).join(':'),
                        });
                    }, 1000);
                }
            }
        },
        formatTime: {
            type: String,
            value: '',
            observer(newVal) {
                if (!newVal) { return }
                const remainSecond = newVal;
                this.setData({
                    remainSecond,
                    ...formatConfirmTime(remainSecond - 1)
                });
                if (Number(remainSecond)) {
                    this.intervalId = setInterval(() => {
                        const { remainSecond } = this.data;
                        this.setData({
                            remainSecond: remainSecond - 1,
                            ...formatConfirmTime(remainSecond - 1)
                        });
                    }, 1000);
                }
            }
        }
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