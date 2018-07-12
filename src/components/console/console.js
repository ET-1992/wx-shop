// 获取全局应用程序实例对象
const app = getApp();

Component({
    properties: {
        page: {
            type: String,
            value: '',
            observer(newValue) {
                if (newValue) {
                    app.log('进入' + newValue);
                }
            }
        }
    },
    data: {
        oldLogData: [],
        isShow: false,
        isConsoleShow: false
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
        console.log('attached');
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
        eventLog() {
            const { logData } = app;
            const { oldLogData } = this.data;
            if (logData.length !== oldLogData.length) {
                const logData_ = logData.map((item) => {
                    return JSON.stringify(item);
                });
                this.setData({
                    oldLogData: logData_
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
                oldLogData: []
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
        }

    }
});

