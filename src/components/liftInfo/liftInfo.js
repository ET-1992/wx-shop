import { checkPhone } from 'utils/util';

Component({
    properties: {
        liftInfo: {
            type: Object,
            value: {},
        },
    },
    data: {
        isError: {
            phone: false
        }
    },
    methods: {
        updateLiftInfoName(e) {
            const { value } = e.detail;
            console.log(value);
            this.triggerEvent('updateLiftInfo', { receiver_name: value }, { bubbles: true });
        },

        updateLiftInfoPhone(e) {
            const { value } = e.detail;
            if (!checkPhone(Number(value))) {
                this.setData({
                    'isError.phone': true
                });
                wx.showToast({
                    icon: 'none',
                    title: '请输入正确的手机号'
                });
            } else {
                this.setData({
                    'isError.phone': false
                });
                this.triggerEvent('updateLiftInfo', { receiver_phone: value }, { bubbles: true });
            }
        }
    }
}
);

