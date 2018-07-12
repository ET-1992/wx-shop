Component({
    properties: {
        video: {
            type: String,
            value: ''
        },
        poster: {
            type: String,
            value: ''
        },
        images: {
            type: Array,
            value: []
        }
    },
    data: {
        type: 'poster',
        videoPlay: false,
        videoTime: 0,
        swiperIndex: 0
    },
    detached() {
        console.log('组件移除');
    },
    methods: {
        changeType(e) {
            const type = e.currentTarget.dataset.type;
            if (this.data.type === type) {
                return;
            }
            if (type === 'video') {
                this.setData({
                    type,
                    videoTime: this.data.videoTime
                });
            } else if (type === 'img') {
                this.setData({
                    type,
                    swiperIndex: this.data.swiperIndex
                });
            }
        },
        touchstart(e) {
            this.data.clineX = e.touches[0].clientX;
        },
        touchend(e) {
            if (e.changedTouches[0].clientX - this.data.clineX < -70) {
                this.setData({
                    type: 'img'
                });
            }
        },
        setVideoTime(e) {
            this.data.videoTime = e.detail.currentTime;
        },
        end() {
            this.setData({
                type: 'poster',
                videoTime: 0
            });
        },
        setSwiperIndex(e) {
            this.data.swiperIndex = e.detail.current;
        }
    }
});

