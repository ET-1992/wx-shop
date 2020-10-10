const app = getApp();

Component({
    properties: {
        scrollTop: {
            type: Number,
            optionalTypes: [String],
            value: 0,
        }
    },
    data: {
        backgroundRgb: '255,255,255',
        barLeftStyle: '',
        barCenterStyle: '',
    },
    lifetimes: {
        attached() {
            // this.getBackgroundRgb();
            this.getChildComponent();
        },
    },
    methods: {
        getChildComponent() {
            const child = this.selectComponent('#navigationBar');
            let { capsulePosition } = child.data,
                { windowWidth } = getApp().globalSystemInfo;

            let rightDistance = windowWidth - capsulePosition.right;
            let navBarLeft = [
                `width:${capsulePosition.width}px`,
                `height:${capsulePosition.height}px`,
                `margin-left:${rightDistance}px`
            ].join(';');
            let barCenterStyle = `height:${capsulePosition.height}px`;
            this.setData({
                barLeftStyle: navBarLeft,
                barCenterStyle,
            });
        },
        // 将颜色哈希值转换成RGB
        getBackgroundRgb() {
            let { backgroundColor: color = '#729153' } = app.globalData.themeColor,
                rgb = '255,255,255';
            if (color.length === 7) {
                color = color.slice(1);
                let arr = [
                    parseInt(color.slice(0, 2), 16),
                    parseInt(color.slice(2, 4), 16),
                    parseInt(color.slice(4, 6), 16),
                ];
                rgb = arr.join(',');
            }
            this.setData({ backgroundRgb: rgb });
        },
    }
});

