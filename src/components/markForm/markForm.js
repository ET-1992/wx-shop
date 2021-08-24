import { chooseImage } from 'utils/wxp';
import api from 'utils/api';
import { checkPhone, checkEmail, checkIdNameNum } from 'utils/util';

const app = getApp();
Component({
    properties: {
        formData: {
            type: Object,
            value: {}
        },
        onlyShow: {
            type: Boolean,
            value: false,
        },
        showSubmitBtn: {
            type: Boolean,
            value: true
        },
        formFields: {
            type: Array,
            value: []
        }
    },
    observers: {
        // 过滤未填写留言
        'formData, onlyShow': function(formData, onlyShow) {
            if (!formData.fields) { return }
            let showForm = formData.fields;
            if (onlyShow) {
                showForm = formData.fields.filter(item => item.value);
            }
            this.setData({ showForm });
        },
        'formFields': function(newVal) {
            if (newVal && newVal.length) {
                const { formData } = this.data;
                formData.fields = newVal;
                this.setData({
                    formData
                });
            }
        }
    },
    data: {
        themeColor: app.globalData.themeColor || {},
        showForm: [],
    },
    methods: {

        // 输入框聚焦/失焦
        onFormFocus(e) {
            let { type, currentTarget: { dataset: { name }}} = e,
                { formData } = this.data,
                formItem = formData.fields.find(item => item.name === name),
                isFocused = false;

            // 文本会不断触发聚焦和失焦
            if (formItem.type === 'textarea' || formItem.type === 'text') { return }
            if (type === 'focus') {
                isFocused = true;
            }
            this.triggerEvent('change-form-focus',
                { isFocused }, { bubbles: true, composed: true });
        },
        // 表单输入
        onFormChange(e) {
            let { detail, currentTarget: { dataset: { name }, }} = e,
                { formData } = this.data,
                index = formData.fields.findIndex(item => item.name === name);
            console.log(index);
            if (formData.fields[index].type === 'select') {
                // 下拉选择
                detail = formData.fields[index].options[detail.value];
            } else if (detail.value) {
                // 日期/时间
                detail = detail.value;
            }
            formData.fields[index].value = detail;
            console.log(formData);
            this.setData({ formData });
        },
        async onUpload(e) {
            let { name } = e.currentTarget.dataset,
                { formData } = this.data,
                index = formData.fields.findIndex(item => item.name === name);
            const { tempFilePaths } = await chooseImage({
                count: 1
            });
            console.log(tempFilePaths, 345);
            try {
                const data = await api.hei.upload({
                    filePath: tempFilePaths[0]
                });
                const { url, errcode, errmsg } = JSON.parse(data);
                if (errcode) {
                    wx.showModal({
                        title: '温馨提示',
                        content: errmsg,
                        showCancel: false
                    });
                } else {
                    formData.fields[index].value = url;
                    console.log(formData.fields);
                    this.setData({ formData });
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        // 文件读取完成
        async onAfterRead(e) {
            console.log('e', e);
            let { file } = e.detail,
                { name } = e.currentTarget.dataset,
                { formData } = this.data,
                index = formData.fields.findIndex(item => item.name === name);

            try {
                const data = await api.hei.upload({
                    filePath: file.url || file.path
                });
                let { url } = JSON.parse(data);
                formData.fields[index].value = [{ url }];

                this.setData({ formData });

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
                { formData } = this.data,
                index = formData.fields.findIndex(item => item.name === name);

            formData.fields[index].value = '';
            this.setData({ formData });
        },
        previewImg(e) {
            let { url } = e.currentTarget.dataset;
            wx.previewImage({
                urls: [url]
            });
        },
        // 表单验证和收集数据
        handleValidate() {
            let { formData } = this.data;
            let errMsg = '';

            for (const item of formData.fields) {
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
                throw new Error(errMsg);
            };
            return errMsg ? showError() : formData.fields;
        },

        submit() {
            const formData = this.handleValidate();
            this.triggerEvent('submit', { form: formData });
        }
    },
});
