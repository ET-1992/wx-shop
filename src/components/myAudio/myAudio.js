Component({
    properties: {
        poster: {
            type: String,
            value: ''
        },
        author: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        src: {
            type: String,
            value: ''
        }
    },

    data: {
        audioStatus: 0, // 0 暂停 1 播放
        timeShow: '00:00',
        time: 0
    },

    methods: {
        changeTime(t) {
            return Math.floor(t / 60) + ':' + (t % 60 / 100).toFixed(2).slice(-2);
        },
        ctr() {
            const { audioStatus } = this.data;
            if (audioStatus === 0) {
                this.audioCtx.play();
                this.setData({
                    audioStatus: 1
                });
            }
            if (audioStatus === 1) {
                console.log('1');
                this.audioCtx.pause();
                this.setData({
                    audioStatus: 0
                });
            }
        }
    },

    ready() {
        console.log('ready');
        const { src } = this.data;
        this.audioCtx = wx.createInnerAudioContext();
        this.audioCtx.src = src;
        this.audioCtx.onPlay(() => {
            this.timer = setInterval(() => {
                let { time, timeShow } = this.data;
                time++;
                timeShow = this.changeTime(time);
                this.setData({
                    time,
                    timeShow
                });
            }, 1000);
        });

        this.audioCtx.onPause(() => {
            console.log('pause');
            clearInterval(this.timer);
        });

        this.audioCtx.onStop(() => {
            clearInterval(this.timer);
        });
    }
});

