Component({
    properties: {
        backgroundRgb: {
            type: String,
            value: '255, 255, 255'
        },
        customStyle: {
            type: String,
            value: ''
        },
    },
    lifetimes: {
        attached() {
            // 触发背景色改变
            this.setData({
                showBgColor: true,
            });
        },
    },

});

