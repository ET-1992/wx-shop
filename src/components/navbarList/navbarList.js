const app = getApp();
Component({
    properties: {
        navbarListData: {
            type: Array,
            value: [],
        },
        themeColor: {
            type: Object,
            value: {}
        },
        template: {
            type: String,
            value: 'default'
        },
        activeIndex: {
            type: Number,
            value: 0,
            observer(newvalue) {
                this.setData({
                    toView: `tab${newvalue}`
                });
            }
        },
        top: {
            type: String,
            value: '',
            observer(newvalue) {
                console.log(newvalue);
            }
        },
        position: {
            type: String,
            value: '',
            observer(newvalue) {
                console.log(newvalue);
            }
        },
        customStyle: {
            type: String,
            value: ''
        },
    },
    attached() {
        this.setData({ themeColor: app.globalData.themeColor });
    },
    methods: {
        changeActive(e) {
            const res = e.currentTarget.dataset;
            let data = { activeIndex: res.index };
            data.toView = `tab${res.index}`;
            this.setData(data);
            this.triggerEvent('changeNavbarList', res, { bubbles: true });
        }
    }
});

