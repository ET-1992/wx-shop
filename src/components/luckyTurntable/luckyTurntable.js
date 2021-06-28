let app = getApp();
Component({
    properties: {
        options: {
            type: Array,
            value: [],
        },
        maxCount: {
            type: Number,
            value: 2
        }
    },
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: ''
    },
    attached() {
        app.awardsConfig = {
            chance: true,
            awards: [
                { 'index': 0, 'name': '谢谢参与' },
                { 'index': 1, 'name': '购买机会' },
                { 'index': 2, 'name': '谢谢参与' },
                { 'index': 3, 'name': '购买机会' },
                { 'index': 4, 'name': '谢谢参与' },
            ]
        };

        // 绘制转盘
        let awardsConfig = app.awardsConfig.awards,
            len = awardsConfig.length,
            html = [],
            turnNum = 1 / len; // 文字旋转 turn 值

        for (let i = 0; i < len; i++) {
            html.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name });
        }

        this.setData({
            btnDisabled: app.awardsConfig.chance ? '' : 'disabled',
            awardsList: html
        });
    },
    methods: {
        getLottery() {
            let currentCount = app.currentCount || 0;
            const { awardsList, maxCount } = this.data;
            let awardIndex = Math.random() * awardsList.length >>> 0;

            // 获取奖品配置
            let awardsConfig = app.awardsConfig,
                runNum = 8;

            app.currentCount = ++currentCount;

            if (currentCount >= maxCount) awardsConfig.chance = false;
            console.log(currentCount);

            // 旋转抽奖
            app.runDegs = app.runDegs || 0;
            console.log('deg', app.runDegs);
            app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / awardsList.length));
            console.log('deg', app.runDegs);

            let animationRun = wx.createAnimation({
                duration: 4000,
                timingFunction: 'ease'
            });
            this.animationRun = animationRun;
            animationRun.rotate(app.runDegs).step();
            this.setData({
                animationData: animationRun.export(),
                btnDisabled: 'disabled'
            });


            // 中奖提示
            setTimeout(() => {
                wx.showModal({
                    title: '恭喜',
                    content: '获得' + (awardsConfig.awards[awardIndex].name),
                    showCancel: false
                });
                if (awardsConfig.chance) {
                    this.setData({
                        btnDisabled: ''
                    });
                }
            }, 4000);
        },
    }
});

