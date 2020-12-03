import api from 'utils/api';
import { checkPhone, checkEmail, checkIdNameNum } from 'utils/util';

const app = getApp();
Component({
    properties: {
        form: {
            type: Array,
            value: [],
        },
        onlyShow: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        themeColor: app.globalData.themeColor || {},
    },
    methods: {
        // 表单输入
        onFormChange(e) {
            let { detail, currentTarget: { dataset: { name }, }} = e,
                { form } = this.data,
                index = form.findIndex(item => item.name === name);

            if (form[index].type === 'select') {
                // 下拉选择
                detail = form[index].options[detail.value];
            } else if (detail.value) {
                // 日期/时间
                detail = detail.value;
            }
            form[index].value = detail;
            this.setData({ form });
        },

        // 文件读取完成
        async onAfterRead(e) {
            // console.log('e', e);
            let { file } = e.detail,
                { name } = e.currentTarget.dataset,
                { form } = this.data,
                index = form.findIndex(item => item.name === name);

            try {
                const data = await api.hei.upload({
                    filePath: file.path
                });
                let { url } = JSON.parse(data);
                form[index].value = [{ ...file, url }];

                this.setData({ form });

            } catch (e) {
                wx.showModal({
                    title: '温馨提示',
                    content: e.errmsg || e.errMsg,
                    showCancel: false
                });
            }
        },

        // 文件删除
        onFileDelete(e) {
            let { name } = e.currentTarget.dataset,
                { form } = this.data,
                index = form.findIndex(item => item.name === name);

            form[index].value = '';
            this.setData({ form });
        },

        // 表单验证和收集数据
        handleValidate() {
            let { form } = this.data;
            let errMsg = '';

            for (const item of form) {
                let { name, value, required, type } = item;
                if (!value) {
                    required && (errMsg = `请输入${name}`);
                } else if (type === 'phone_number' && !checkPhone(value)) {
                    errMsg = `请输入正确的手机格式`;
                } else if (type === 'email' && !checkEmail(value)) {
                    errMsg = `请输入正确的邮箱格式`;
                } else if (type === 'id_number' && !checkIdNameNum(value)) {
                    errMsg = `请输入18位数的身份证号码`;
                }
            }
            let showError = () => {
                wx.showToast({ title: errMsg, icon: 'none' });
                console.log('error form validate', form);
                throw new Error(errMsg);
            };
            return errMsg ? showError() : form;
        },
    },
});
