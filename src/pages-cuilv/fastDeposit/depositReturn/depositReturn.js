import { checkPhone } from 'utils/util';
// import { BANK_CARD_LIST } from 'utils/bank';
import api from 'utils/api';
Page({
    data: {
        title: 'depositReturn',
        deposit_order_no: '',
        isLoading: false,
        form: {
            phoneNumber: '',
            bank: '',
            bankNumber: ''
        },
        // banks: BANK_CARD_LIST,
        goldPrice: '0',  // 实时进价
        goldWeight: '0', // 回购重量
        totalPrice: '0'  // 预估金额
    },

    onLoad(params) {
        console.log(params);
        this.setData({
            deposit_order_no: params.no
        });
        this.loadData();
    },
    bindinputValue(e) {
        let name = e.currentTarget.dataset.name;
        let value = e.detail.value;
        this.setData({
            [name]: value
        });
    },
    // bindPickerChange(e) {
    //     let { value } = e.detail;
    //     let { banks, form } = this.data;
    //     let bank = 'form.bank';
    //     this.setData({
    //         index: value,
    //         [bank]: banks[value].bankName
    //     });
    // },
    showToast(title) {
        wx.showToast({ title: title, icon: 'none', image: '', duration: 1000 });
        return false;
    },

    async loadData() {
        let { deposit_order_no } = this.data;
        const data = await api.hei.getDepositOrder({
            deposit_order_no,
        });
        let { base_price, data: { weight }, estimate_price } = data;
        this.setData({
            goldPrice: base_price,
            goldWeight: weight,
            totalPrice: estimate_price
        });
    },

    // 确定提交
    submitForm() {
        let { phoneNumber, bank, bankNumber } = this.data.form;
        if (phoneNumber.length === 0) {
            this.showToast('手机号不能为空');
        } else if (!checkPhone(phoneNumber)) {
            this.showToast('请输入正确的手机号');
        } else if (phoneNumber.length !== 11) {
            this.showToast('手机号长度有误');
        } else if (bank.length === 0) {
            this.showToast('开户行不能为空');
        } else if (bankNumber.length === 0) {
            this.showToast('银行卡号不能为空');
        } else {
            this.postForm();
        }
    },

    // 提交表单
    async postForm() {
        let { deposit_order_no, form: { phoneNumber, bank, bankNumber }} = this.data;
        try {
            const data = await api.hei.postDepositReturn({
                deposit_order_no,
                bank_phone: phoneNumber,
                bank_name: bank,
                bank_account: bankNumber
            });
            wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
            });
            wx.navigateBack();
        } catch (err) {
            this.showToast(err.errMsg);
        }
    }
});
