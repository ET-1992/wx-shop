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
    data: {
        isShowPopup: false,
        selectedPopupIndex: 0
    },
    attached() {
        this.setData({ themeColor: app.globalData.themeColor });
    },
    methods: {
        changeActive(ev) {
            console.log(ev, '--ev');
            const { navbarListData } = this.data;
            let index = ev.detail.index || ev.currentTarget.dataset.index;
            let value = navbarListData[index] && navbarListData[index].value;
            this.setData({
                activeIndex: index,
                toView: `tab${index}`,
                isShowPopup: false
            });
            this.triggerEvent('changeNavbarList', { index, value }, { bubbles: true });
        },
        onShowPopup() {
            let { isShowPopup, activeIndex } = this.data;
            this.setData({
                isShowPopup: !isShowPopup,
                selectedPopupIndex: activeIndex
            });
        }
    }
});

