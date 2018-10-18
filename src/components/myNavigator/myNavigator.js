import api from 'utils/api';

Component({
    properties: {
        navigator: {
            type: Object,
            value: {},
        },
        defineObj: {
            type: Object,
            value: {},
        },
        defineType: {
            type: String,
            value: 'define',
        },
        url: {
            type: String,
            value: '',
        }
    },
    data: {},
    methods: {
        onTap() {
            console.log('erere');
        },
        submitFormId(e) {
            const { formId } = e.detail;
            api.hei.submitFormId({
                form_id: formId
            }).then(() => {
                console.log('formId发送成功', formId);
            });
            if (this.data.url) {
                wx.navigateTo({
                    url: this.data.url
                });
            }
        }
    }
});

