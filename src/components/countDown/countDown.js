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
            type: Number,
            value: 0,
            observer(newVal) {
                if (newVal <= 0) { return }
                let remainSecond = newVal;
                this.setData({
                    remainSecond,
                    remainTime: getRemainTime(remainSecond).join(':')
                });
                this.intervalId = setInterval(() => {
                    --remainSecond;
                    this.setData({
                        remainSecond,
                        remainTime: getRemainTime(remainSecond).join(':'),
                    });
                    if (remainSecond <= 0) {
                        clearInterval(this.intervalId);
                        console.log('倒计时结束');
                        this.triggerEvent('onCountDownEvent', { remainSecond });		// 返回倒计时结束通知
                    }
                }, 1000);

            }
        },
        formatTime: {
            type: Number,
            value: 0,
            observer(newVal) {
                if (newVal <= 0) { return }
                let remainSecond = newVal;
                this.setData({
                    remainSecond,
                    ...formatConfirmTime(remainSecond - 1)
                });
                this.intervalId = setInterval(() => {
                    --remainSecond;
                    this.setData({
                        remainSecond,
                        ...formatConfirmTime(remainSecond)
                    });
                    if (remainSecond <= 0) {
                        clearInterval(this.intervalId);
                        console.log('倒计时结束');
                        this.triggerEvent('onCountDownEvent', { remainSecond });		// 返回倒计时结束通知
                    }
                }, 1000);
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