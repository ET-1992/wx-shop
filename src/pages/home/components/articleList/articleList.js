import { go } from 'utils/util';

Component({
    properties: {
        articleList: {
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
        }
    },

    methods: {
        go
    }
});