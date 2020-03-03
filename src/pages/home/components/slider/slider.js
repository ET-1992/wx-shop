Component({
    properties: {
        slide: {
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
        userInfo: {
            type: Object,
            value: {}
        }
    },
    data: {
        swiperCurrent: 0
    },
    methods: {
        swiperChange(e) {
            // console.log('e', e);
            this.setData({
                swiperCurrent: e.detail.current
            });
        },

        miniFail(e) {
            this.triggerEvent('miniFail', {}, { bubbles: true });
        },

        showContactModal(e) {
            this.triggerEvent('showContactModal', e, { bubbles: true });
        }
    }
});

