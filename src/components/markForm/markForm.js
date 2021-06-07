import { chooseImage } from 'utils/wxp';
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
        },
        showSubmitBtn: {
            type: Boolean,
            value: false
        }
    },
    observers: {
        // 过滤未填写留言
        'form, onlyShow': function(form, onlyShow) {
            if (!form) { return }
            let showForm = form;
            if (onlyShow) {
                showForm = form.filter(item => item.value);
            }
            this.setData({ showForm });
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
                { form } = this.data,
                formItem = form.find(item => item.name === name),
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
            let { detail, currentTarget: { dataset: { index }}} = e,
                { form } = this.data;

            if (form[index].type === 'select') {
                // 下拉选择
                detail = form[index].options[detail.value];
            } else if (detail.value) {
                // 日期/时间
                detail = detail.value;
            }
            console.log(detail);
            form[index].value = detail;
            console.log(form);
            this.setData({ form });
        },
        // 文件上传
        async onUpload(e) {
            let { name } = e.currentTarget.dataset,
                { form } = this.data,
                index = form.findIndex(item => item.name === name);
            const { tempFilePaths } = await chooseImage({
                count: 1
            });
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
                    form[index].value = url;
                    this.setData({ form });
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        /* 预览图片 */
        previewImg(e) {
            let { url } = e.currentTarget.dataset;
            wx.previewImage({
                urls: [url]
            });
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
                throw new Error(errMsg);
            };
            return errMsg ? showError() : form;
        },

        submit() {
            const form = this.handleValidate();
            this.triggerEvent('submit', { form });
        }
    },
});
