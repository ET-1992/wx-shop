import { checkIdNameNum, go } from 'utils/util';
import proxy from 'utils/wxProxy';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        title: 'idCard',
        userName: '',
        idNumber: '',
        idCardImage1: '',
        idCardImage2: '',
        checked: false
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        this.setData({
            themeColor
        });
        this.init();
    },

    // onShow() {
    //     this.init();
    // },

    // 初始化表单内容
    async init() {
        // const { userName, idNumber, idCardImage1, idCardImage2 } = this.data;
        try {
            const { profile } = await api.hei.getIdentityInfo();
            console.log(profile);
            this.setData({
                userName: profile.name,
                idNumber: profile.id_card_no,
                idCardImage1: profile.id_card_image1,
                idCardImage2: profile.id_card_image2
            });
        } catch (error) {
            console.log(error);
        }
    },

    // 获取真实姓名
    bindNameInput(e) {
        const { value } = e.detail;
        console.log(value);

        this.setData({
            userName: value
        });
    },

    // 获取身份证号
    bindNumberInput(e) {
        const { value } = e.detail;
        console.log(value);

        this.setData({
            idNumber: value
        });
    },

    // 上传照片公共代码
    async onUpload() {
        const { tempFilePaths } = await proxy.chooseImage({
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
                return url;
            }
        } catch (err) {
            console.log(err);
        }
    },

    // 上传身份证正面照
    async onUploadIDCard() {
        const { idCardImage1 } = this.data;
        const res = await this.onUpload();
        this.setData({
            idCardImage1: res
        });
    },

    // 上传身份证反面照
    async onUploadReverseSideOfIDCard() {
        const { idCardImage2 } = this.data;
        const res = await this.onUpload();
        this.setData({
            idCardImage2: res
        });
    },

    // 提交表单内容
    async formSubmit() {
        const { userName, idNumber = '', idCardImage1, idCardImage2 } =  this.data;
        let error = '';

        if (!this.data.checked) {
            wx.showToast({ title: '请阅读并同意《用户服务协议》与《隐私政策》', icon: 'none', image: '', duration: 1000 });
            return false;
        }

        !checkIdNameNum(idNumber) && (error = '请输入正确的身份证号码');
        !idCardImage1 && (error = '请上传身份证正面照');
        !idCardImage2 && (error = '请上传身份证反面照');
        !idNumber && (error = '身份证号不能为空');
        !userName && (error = '姓名不能为空');

        if (error) {
            wx.showToast({
                icon: 'none',
                title: error
            });
            return;
        }

        try {
            const res = await api.hei.uploadIdentity({
                name: userName,
                id_card_no: idNumber,
                id_card_image1: idCardImage1,
                id_card_image2: idCardImage2
            });
            proxy.showToast({
                title: '保存成功'
            });
            if (!res.errcode) {
                wx.switchTab({
                    url: '/pages/me/me'
                });
            }
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.errMsg,
                showCancel: false,
            });
        }
    },

    onChange(event) {
        this.setData({
            checked: event.detail
        });
        console.log('checked', this.data.checked);
    },

    go
});
