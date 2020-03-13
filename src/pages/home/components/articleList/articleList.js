import { go, autoNavigate_ } from 'utils/util';

Component({
    properties: {
        articleList: {
            type: Object,
            value: {},
            observer(newVal) {
                console.log(newVal, 'ddd')
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
        isShowMore: {
            type: Boolean,
            value: true
        }
    },

    methods: {
        go,
        goMore() {
            const { id } = this.data;
            autoNavigate_({ url: '/pages/articleList/articleList?module_id=' + id });
        }
    }
});