import { checkPhone } from 'utils/util';

Page({
    data: {
        title: 'affiliateFinishUserInfo',
        isError: {
            phone: false,
            card: false
        }
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    check(e) {
        const { value } = e.detail;
        if (!checkPhone(value)) {
            this.setData({
                'isError.phone': true
            });
        }
    },

    reset() {
        this.setData({
            'isError.phone': false
        });
    }
});
