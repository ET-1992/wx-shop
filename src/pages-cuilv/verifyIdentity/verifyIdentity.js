import proxy from 'utils/wxProxy';
import api from 'utils/api';

Page({
    data: {
        title: 'verifyIdentity',
        isLoading: true,
        userName: '',
        idNumber: '',
        idCardFront: '',
        idCardBack: '',
    },

    onLoad(params) {
        this.getInitData();
        console.log(params);
    },

    // 获取认证信息
    async getInitData() {
        let data = await api.hei.getRepoIdentity();
        let { name, id_card_no, id_card_image1, id_card_image2 } = data.profile;
        this.setData({ isLoading: false });
        if (name) {
            this.setData({
                userName: name,
                idNumber: id_card_no,
                idCardFront: id_card_image1,
                idCardBack: id_card_image2,
            });
        }
    },

    // 获取姓名或身份证输入
    getInput(e) {
        let { value } = e.detail;
        let { name } = e.currentTarget.dataset;
        this.setData({
            [name]: value
        });
    },

    // 上传身份证
    async onUploadImg(e) {
        let imgArray = ['idCardFront', 'idCardBack'];
        let { key } = e.currentTarget.dataset;
        let img = imgArray[key];

        try {
            let { tempFilePaths } = await proxy.chooseImage({
                count: 1
            });

            if (tempFilePaths) {
                let data = await api.hei.upload({
                    filePath: tempFilePaths[0]
                });
                let { url } = JSON.parse(data);
                this.setData({
                    [img]: url
                });
            }
        } catch (e) {
            console.log(e);
        }
    },

    // 提交实名认证
    async onSubmit() {
        let { userName, idNumber, idCardFront, idCardBack } = this.data;
        // 表单验证
        let error = '';
        idNumber.length === 18 || (error = '请输入18位的身份证号码');
        idCardFront || (error = '请上传身份证正面照');
        idCardBack || (error = '请上传身份证反面照');
        idNumber || (error = '身份证号不能为空');
        userName || (error = '姓名不能为空');
        if (error) {
            wx.showToast({ title: error, icon: 'none' });
            return;
        }
        // 提交请求
        try {
            let data = api.hei.postIdentity({
                name: userName,
                id_card_no: idNumber,
                id_card_image1: idCardFront,
                id_card_image2: idCardBack,
            });
            const { confirm } = await proxy.showModal({
                title: '温馨提示',
                content: '提交成功！请返回上一页',
                showCancel: false,
            });
            if (confirm) {
                wx.navigateBack({ delta: 1 });
            }
        } catch (e) {
            wx.showToast({
                title: e.errMsg || '提交失败',
                icon: 'none',
                duration: 2000
            });
        }
    },
});
