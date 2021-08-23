let app = getApp();
import api from 'utils/api';
import { CONFIG } from 'constants/index';
Component({
    properties: {
        options: {
            type: Array,
            value: [],
        },
        maxCount: {
            type: Number,
            value: 2
        },
        activity: {
            type: Object,
            value: {}
        }

    },
    data: {
        animationData: {},
    },
    attached() {
        const config = wx.getStorageSync(CONFIG);
        const { options } = this.data;
        // 绘制转盘
        let len = options.length,
            turnNum = 1 / len; // 文字旋转 turn 值

        for (let i = 0; i < len; i++) {
            options[i].turn = i * turnNum + 'turn';
        }
        this.setData({
            options,
            config
        });
    },
    methods: {
        async getLottery() {
            try {
                let { options, runDegs = 0, activity: { id }} = this.data;
                const { win, record } = await api.hei.startLottery({ activity_id: id });
                this.triggerEvent('getLotteryStart');
                // 获取奖品配置
                let runNum = 8, // 转动的圈数，固定8圈 可自行设置
                    resultIndex = [];
                const key = win ? 'win' : '';

                options.forEach((item, index) => {
                    if (item.key === key) {
                        resultIndex.push(index);
                    }
                });
                this.setData({
                    pending: true
                });
                // 拿到随机项
                let awardIndex = resultIndex[Math.random() * resultIndex.length >>> 0];

                // 旋转抽奖
                runDegs = runDegs + (360 - runDegs % 360) + (360 * runNum - awardIndex * (360 / options.length));
                let animationRun = wx.createAnimation({
                    duration: 4000,
                    timingFunction: 'ease'
                });
                this.animationRun = animationRun;
                animationRun.rotate(runDegs).step();
                this.setData({
                    animationData: animationRun.export(),
                    runDegs
                });
                // 中奖提示
                setTimeout(() => {
                    this.triggerEvent('getLotteryEnd', { result: key, record });
                    this.setData({
                        pending: false
                    });
                }, 4000);
            } catch (e) {
                wx.showModal({
                    title: '提示',
                    content: e.errMsg,
                    showCancel: false
                });
            }
        },
    }
});

