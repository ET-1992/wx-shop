
import api from 'utils/api';

const app = getApp();

Component({
    properties: {
        title: {
            type: String,
            value: null,
        },
        inputType: {
            type: String,
            value: 'text',
        },
        placeholder: {
            type: String,
            value: '请输入',
        },
        isShowMock: {
            type: Boolean,
            value: true,
        }
    },

    data: {
        inputText: null
    },

    methods: {
        onInput(ev) {
            const { value } = ev.detail;
            this.setData({ inputText: value });
        },
        onSave() {
            this.triggerEvent('promptConfirm', this.data.inputText);
        },
    }
});
