import { go } from 'utils/util';

Component({
    properties: {
        module: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { content, setting, title, type, id, args = 'product_category_id=44&product_category_parent=44' } = newVal;
                this.setData({
                    content,
                    setting,
                    title,
                    type,
                    id,
                    args
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

    methods: {
        go
    }
});