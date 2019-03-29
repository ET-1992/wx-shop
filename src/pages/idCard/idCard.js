import { checkIdNameNum } from 'utils/util';
import proxy from 'utils/wxProxy';
import api from 'utils/api';
const app = getApp();

Page({
    data: {
        title: 'idCard',
        userName: '',
        idNumber: '',
        idCardImage1: '',
        idCardImage2: ''
    },

    // 获取真实姓名
    bindNameInput(e) {
        const { value } = e.detail;

        this.setData({
            userName: value
        });
    },

    // 获取身份证号
    bindNumberInput(e) {
        const { value } = e.detail;

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
            const { url } = JSON.parse(data);
            console.log(url);
            return url;
        } catch (err) {
            console.log(err);
        }
    },

    // 上传身份证正面照
    onUploadIDCard() {
        const { idCardImage1 } = this.data;
        this.onUpload().then(res => {
            console.log(res);
            this.setData({
                idCardImage1: res
            });
            console.log(this.data.idCardImage1);
        });
        console.log('sss');
    },

    // 上传身份证反面照
    onUploadReverseSideOfIDCard() {
        const { idCardImage2 } = this.data;
        this.onUpload().then(res => {
            console.log(res);
            this.setData({
                idCardImage2: res
            });
            console.log(this.data.idCardImage2);
        });
        console.log('sss');
    },

    // 提交表单内容
    async formSubmit() {
        const { userName, idNumber = '', idCardImage1, idCardImage2 } =  this.data;
        let error = '';

        !checkIdNameNum(idNumber) && (error = '请输入正确的身份证号码');
        !idCardImage1 && (error = '请上传身份证件');
        !idCardImage2 && (error = '请上传身份证件');
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
            console.log(idCardImage1);
            console.log(idCardImage2);
            const res = await api.hei.uploadIdentity({
                name: userName,
                id_card_no: idNumber,
                id_card_image1: idCardImage1,
                id_card_image2: idCardImage2
            });
            console.log(res);
            if (!res.errcode) {
                proxy.showToast({
                    title: '保存成功'
                });
            }
        } catch (error) {
            console.log(error);
        }
    },

    // 初始化表单内容
    async init() {
        const { userName, idNumber, idCardImage1, idCardImage2 } = this.data;
        try {
            const { profile } = await api.hei.getIdentityInfo();
            console.log(profile);
            this.setData({
                userName: profile.name,
                idNumber: profile.id_card_no,
                idCardImage1: profile.id_card_image1,
                idCardImage2: profile.id_card_image2
            });
            console.log(this.data.userName);
        } catch (error) {
            console.log(error);
        }
    },

    onLoad(params) {
        console.log(params);
        const { themeColor } = app.globalData;
        this.setData({
            themeColor
        });
    },

    onShow() {
        this.init();
    }
});
