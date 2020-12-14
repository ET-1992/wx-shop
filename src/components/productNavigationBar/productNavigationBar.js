import { CONFIG } from 'constants/index';
import { go, colorRgb } from 'utils/util';
const app = getApp();

Component({
    properties: {
        // 导航栏类型(目前只有homeNav和productNav两种)
        navType: {
            type: String,
            value: ''
        },
        // 是否显示搜索框
        showSearchBox: {
            type: Boolean,
            vaule: true
        },
        title: {
            type: String,
            value: ''
        },
        showBgColor: {
            type: Boolean,
            value: false
        },
    },
    data: {
        barLeftStyle: '',  // 导航栏左边样式类
        barCenterStyle: '',  // 导航栏中间样式类
    },
    lifetimes: {
        attached() {
            this.getConfigData();
            this.getChildComponent();
        },
    },
    pageLifetimes: {
        show() {
            this.setData({
                globalData: app.globalData
            });
        }
    },
    methods: {

        go,

        // 获取页面配置信息
        getConfigData() {
            const config = wx.getStorageSync(CONFIG);
            const { themeColor, themeColor: { backgroundColor }} = app.globalData;
            const backgroundRgb = colorRgb(backgroundColor);
            this.setData({
                globalData: app.globalData,
                config,
                themeColor,
                backgroundRgb,
            });
        },

        // 获取子组件数据
        getChildComponent() {
            // 这里直接获取子组件有可能获取不到capsulePosition，直接在app.globalSystemInfo获取
            let { windowWidth, capsulePosition } = getApp().globalSystemInfo;
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
    }
});

