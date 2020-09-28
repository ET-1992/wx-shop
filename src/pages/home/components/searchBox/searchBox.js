import { CONFIG } from 'constants/index';

Component({
    properties: {
        total: {
            type: String,
            value: ''
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        },
        // 是否只显示搜索框
        onlySearchBox: {
            type: Boolean,
            value: true,
        }
    },
    data: {
        config: {},
        currentStore: {},
        value: ''
    },
    lifetimes: {
        attached: function() {
            let config = wx.getStorageSync(CONFIG);
            this.setData({ config });
        },
    },
    methods: {
        inputChangeHandle(e) {
            const { value } = e.detail;
            this.setData({ value });
        },
        runToSearch() {
            wx.navigateTo({
                url: `/pages/search/search?key=${this.data.value}`
            });
        }
    }
});