// 获取全局应用程序实例对象
const app = getApp();

Component({
    properties: {
        page: {
            type: String,
            value: '',
            observer(newValue) {
                if (newValue) {
                    app.log('进入' + newValue + '页面');
                }
            }
        }
    },
    data: {
        oldLogData: [],
        isShow: false,
        isConsoleShow: false,
        keyName: null,
        oldLogDataCtr: []
    },
    created() {
        console.log('created');
    },
    ready() {
        console.log('ready');
        if (app.openConsole) {
            app.event.on('log', this.eventLog, this);
        }
        app.event.on('showConsole', this.eventShowConsole, this);
    },
    attached() {
        if (app.openConsole) {
            this.setData({
                oldLogData: [],
                isConsoleShow: true
            });
        }
    },
    moved() {
        console.log('moved');
    },
    detached() {
        console.log('组件移除');
        app.logData = [];
        this.setData({
            oldLogData: []
        });
        app.event.off('log', this);
        app.event.off('showConsole', this);
    },
    methods: {
        eventLog(opt, reload = false) {
            const { logData } = app;
            const { oldLogData, keyName, oldLogDataCtr } = this.data;
            const reg = new RegExp(`${keyName}`, 'g');
            if (logData.length !== oldLogData.length || reload) {
                let logData_ = logData.map((item) => {
                    return JSON.stringify(item, null, 4).replace(reg, `@@${keyName}@@`).split('@@');
                });

                logData.forEach((item, index) => {
                    const itemJson = JSON.stringify(item);
                    if (!oldLogDataCtr[index]) {
                        oldLogDataCtr[index] = {};
                    }
                    oldLogDataCtr[index].isShowZheDie = itemJson.length > 800;
                    oldLogDataCtr[index].isShowCopy = itemJson.indexOf('请求路径') > -1 || itemJson.indexOf('Content-Type') > -1;
                });

                this.setData({
                    oldLogData: logData_,
                    oldLogDataCtr
                });
            }
        },

        eventShowConsole() {
            app.event.on('log', this.eventLog, this);
            this.setData({
                isConsoleShow: true
            });
        },

        clear() {
            app.logData = [];
            this.setData({
                oldLogData: [],
                keyName: null
            });
        },

        hide() {
            this.setData({
                isShow: false
            });
        },

        show() {
            this.setData({
                isShow: true
            });
        },

        setKeyName(e) {
            const { value } = e.detail;
            this.setData({
                keyName: value || null
            }, () => {
                this.eventLog(null, true);
            });
        },

        zheDie(e) {
            const { index } = e.currentTarget.dataset;
            const { oldLogDataCtr } = this.data;
            oldLogDataCtr[index].isZheDie = !oldLogDataCtr[index].isZheDie;
            this.setData({
                oldLogDataCtr
            });
        },

        copy(e) {
            const { item } = e.currentTarget.dataset;
            wx.setClipboardData({
                data: item[0],
                success: (result) => {
                    wx.showToast({
                        title: '复制成功',
                        icon: 'none',
                        image: '',
                        duration: 1500,
                        mask: false,
                        success: (result) => {

                        },
                        fail: () => {},
                        complete: () => {}
                    });
                },
                fail: () => {},
                complete: () => {}
            });
        }

    }
});

