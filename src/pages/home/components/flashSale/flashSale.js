import getRemainTime from 'utils/getRemainTime';
import { go } from 'utils/util';

Component({
    properties: {
        module: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title, type, id } = newVal;
                this.setData({
                    content,
                    setting,
                    title,
                    type,
                    id
                });
            }
        },
        themeColor: {
            type: Object,
            value: {}
        },
        globalData: {
            type: Object,
            value: {}
        }
    },

    data: {
        nowTS: Date.now() / 1000,
        remainTime: {
            hour: '00',
            minute: '00',
            second: '00',
        },
        hasStart: true,
        hasEnd: false,
        timeLimit: 0
    },

    methods: {
        go
    }
});