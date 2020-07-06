import api from 'utils/api';
import proxy from 'utils/wxProxy';
import { chooseImage } from 'utils/wxp';
import { debounce } from 'utils/util';
import { CONFIG } from 'constants/index';

const app = getApp();

Page({
    data: {
        title: 'evaluate',
        goldPrice: '0',  // 实时金价
        goldAmount: '0',  // 预估金价
        popupTips: { }, // 弹窗信息
        typeSetting: {},  // 黄金类型/回收类型
        isLoading: true,
        sellGoldForm: {
            goldType: 1, // 卖金类型 默认饰品
            images: [], // 上传图片数组
            weight: '',  // 卖金重量
        },
        weightDisable: false,  // 回收固定重量禁用
        dopositId: '',  // 回收订单ID
        IMAGEMAXLENGTH: 9,  // 上传图片最大数
        miniData: {},  // 接收上个页面数据
    },

    onLoad(params) {
        console.log(params);
        this.acceptPageData();
        this.getPrepareData();
    },

    // 获取传递过来的数据
    async acceptPageData() {
        let that = this;
        const eventChannel = this.getOpenerEventChannel();
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        if (!eventChannel.on) { return }
        eventChannel.on('acceptDataFromOpenerPage', function(data) {
            if (data && data.miniData) {
                console.log('从当前小程序其他页面跳转过来');
                that.setData({ miniData: data.miniData });
            }
        });

        this.setPageData();
        this.bindShopApp();
    },

    // 填充传递的表单数据
    setPageData() {
        let { miniData } = this.data;
        let {
            deposit_id,   // 寄存id
            weight,   // 寄存重量
            img_url,  // 寄存上传照片
        } = miniData;
        if (!deposit_id) { return }
        this.setData({
            'sellGoldForm.weight': weight,
            'sellGoldForm.images[0]': img_url,
            weightDisable: true,
            dopositId: deposit_id,
        });
    },

    // 后台追踪相关用户
    async bindShopApp() {
        let { miniData } = this.data;
        if (!miniData.deposit_id) { return }
        try {
            await api.hei.postBindShop(miniData);
            console.log('绑定成功');
        } catch (e) {
            await proxy.showModal({
                title: '温馨提示',
                content: e.errMsg || '绑定数据失败',
                showCancel: false,
            });
            wx.navigateBack();
        }
    },

    // 获取预下单数据
    async getPrepareData() {
        let data = await api.hei.prepareOrder();
        const config = wx.getStorageSync(CONFIG);
        let { base_gold_price, prepare_evaluate_setting, type_settings } = data;
        this.setData({
            config: config,
            goldPrice: base_gold_price,
            popupTips: prepare_evaluate_setting,
            typeSetting: type_settings,
            isLoading: false
        });
    },

    // 显示规则
    showRule(e) {
        let { type } = e.currentTarget.dataset;
        let { sellGoldForm: { goldType, weight }} = this.data;
        let url = '';
        // 预估金额说明
        if (type === 'ESTIMATE') {
            if (!weight) { weight = 0 }
            url = `/pages-cuilv/recycleEstimateNote/recycleEstimateNote?weight=${weight}&type=${goldType}`;
        }
        // 实物图说明
        if (type === 'EXPOUND') {
            let key = 'image_explanation';
            url = `/pages-cuilv/picturePage/picturePage?key=${key}`;
        }
        wx.navigateTo({ url });
    },

    // 黄金类型选择
    radioChange(e) {
        let { value } = e.detail;
        this.setData({
            'sellGoldForm.goldType': value
        });
        let { weight } = this.data.sellGoldForm;
        if (!weight) return;
        this.debounceUpdatePrice();
    },

    // 输入黄金克重
    inputWeight(e) {
        let { value } = e.detail;
        if (value > 10000) value = 10000;
        this.setData({
            'sellGoldForm.weight': value
        });
        this.debounceUpdatePrice();
    },

    // 刷新预估金额
    async updatePrice() {
        let { goldType, weight = 0 } = this.data.sellGoldForm;
        if (!weight) { weight = 0 }
        try {
            const data = await api.hei.getGoldPrice({
                gold_type: goldType,
                weight: weight
            });
            let { estimate_order_amount } = data.fee;
            this.setData({ goldAmount: estimate_order_amount });
        } catch (err) {
            console.log(err);
        }
    },

    // 预估金额防抖
    debounceUpdatePrice: debounce(function() {
        this.updatePrice();
    }),

    // 上传图片
    async onUploadImg() {
        const { sellGoldForm, IMAGEMAXLENGTH } = this.data;
        const { tempFilePaths } = await chooseImage({
            count: IMAGEMAXLENGTH - sellGoldForm.images.length
        });
        try {
            for (let i = 0; i < tempFilePaths.length; i++) {
                const data = await api.hei.upload({
                    filePath: tempFilePaths[i]
                });
                const { errcode, url, errmsg } = JSON.parse(data);
                if (errcode) throw new Error(errmsg);
                sellGoldForm.images.push(url);
                this.setData({ sellGoldForm });
            }
        }
        catch (e) {
            console.log(`报错信息${e}`);
            wx.showModal({
                title: '上传失败',
                content: e.message || e.errmsg,
                showCancel: false,
            });
        }

    },

    // 预览图片
    onPreviewImg(ev) {
        let { index } = ev.currentTarget.dataset;
        let { sellGoldForm } = this.data;
        wx.previewImage({
            urls: sellGoldForm.images,
            current: sellGoldForm.images[index]
        });
    },

    // 删除图片
    onDeleteImg(ev) {
        const { index } = ev.currentTarget.dataset;
        const { sellGoldForm } = this.data;
        sellGoldForm.images.splice(index, 1);
        this.setData({ sellGoldForm });
    },

    // 提交在线估价表单
    onSubmit() {
        let formValidateRes = this.validateForm();
        if (!formValidateRes) { return }
        let { dopositId } = this.data;
        this.compressData();
        let url = '../recycleMakePrice/recycleMakePrice';
        // 小程序直接订单
        if (dopositId) url += `?dopositId=${dopositId}`;
        wx.navigateTo({ url });
    },

    // 表单验证
    validateForm() {
        let { weight, images } = this.data.sellGoldForm;
        let err = '';
        (weight && weight > 0) || (err = '黄金克重必须大于0');
        (images && images.length > 0) || (err = '上传的图片不能为空');
        if (!err) {
            return true;
        }
        wx.showToast({
            title: err || '提交失败',
            icon: 'none'
        });
        return false;
    },

    // 将表单数据存储起来
    compressData() {
        let { sellGoldForm, goldAmount } = this.data;
        let evaluateFormData = { sellGoldForm, goldAmount };
        app.globalData.evaluateFormData = evaluateFormData;
    },

});
