import getRemainTime from 'utils/getRemainTime';
import { CONFIG } from 'constants/index';
const app = getApp();

Component({
    properties: {
        product: {
            type: Object,
            value: {},
            observer(newVal) {
                if (newVal.luckydraw) {
                    const { user_participate_count } = newVal.luckydraw;
                    let { quota: lotteryQuota, quantity } = newVal.luckydraw.activity;
                    this.setData({
                        lotteryQuota,
                        user_participate_count,
                        quantity
                    });
                }
            }
        },
        miaoShaStatus: {
            type: String,
            value: ''
        },
        timeLimit: {
            type: String,
            value: ''
        },
        bargain_mission: {
            type: Object,
            value: {}
        }
    },
    data: {
        globalData: app.globalData,
        themeColor: app.globalData.themeColor,
        timeLimit: 0,
        remainTime: {
            hour: '00',
            minute: '00',
            second: '00',
        }
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        let userTypesText = '';
        const { product } = this.data;
        if (product.miaosha_enable || product.seckill_enable) {
            this.todayTimeLimit();
        }

        if (product.luckydraw) {
            let { target_user_types_text = [] } = product.luckydraw.activity;
            userTypesText = target_user_types_text.join('、');
            this.todayTimeLimit();
        }

        this.setData({
            userTypesText,
            config,
        });
    },
    detached() {
        if (this.intervalId) {
            console.log('清除定时器');
            clearInterval(this.intervalId);
        }
    },
    methods: {
        todayTimeLimit() {
            let { timeLimit } = this.data;
            if (timeLimit && !this.intervalId) {
                this.todayTimeLimitSet();
                this.intervalId = setInterval(() => {
                    this.todayTimeLimitSet();
                }, 1000);
            }
        },

        // 倒计时设置
        todayTimeLimitSet() {
            let { timeLimit } = this.data;
            const [hour, minute, second] = getRemainTime(timeLimit);
            let day = parseInt(hour / 24, 10);
            if (timeLimit < 0) {
                clearInterval(this.intervalId);
                return;
            }
            this.setData({
                'timeLimit': timeLimit - 1,
                remainTime: {
                    day,
                    hour: hour - day * 24,
                    minute,
                    second,
                },
            });
        }
    }
});