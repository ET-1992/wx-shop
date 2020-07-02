import {  CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
import { chooseAddress } from 'utils/wxp';
import { go, transformAddressToCustomer } from 'utils/util';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        title: 'makePrice',
        isLoading: true,
        evaluateFormData: {},  // 上一个页面表单数据
        goldPrice: '0',  // 实时金价
        typeSetting: {},  // 黄金类型/回收类型
        popupTips: {}, // 弹窗信息
        recycleForm: {
            recycleWay: 0, // 回收方式
            address: '', // 地址信息
            serviceAgree: false,  // 服务协议
        },
    },

    onLoad(params) {
        const config = wx.getStorageSync(CONFIG);  // 小程序config数据
        let { dopositId = '' } = params;  // 特定小程序跳转标识
        const { evaluateFormData } = app.globalData;  // 在线估价表单
        this.getPrepareData();

        this.setData({
            config,
            dopositId,
            evaluateFormData,
        });
    },

    go,

    // 返回上一步
    goBack() {
        wx.navigateBack({
            delta: 1
        });
    },

    // 获取预下单数据
    async getPrepareData() {
        let data = await api.hei.prepareOrder();
        let { base_gold_price, prepare_evaluate_setting, type_settings } = data;
        this.setData({
            goldPrice: base_gold_price,
            popupTips: prepare_evaluate_setting,
            typeSetting: type_settings,
            isLoading: false
        });
    },

    // 回收方式
    recycleWayChange(e) {
        this.setData({
            'recycleForm.recycleWay': e.detail.value
        });
    },

    // 获取地址
    async getAddress() {
        let addressRes = await chooseAddress();
        if (addressRes) {
            this.setData({
                'recycleForm.address': addressRes
            });
        }
    },

    // 服务条款
    onServiceAgree(event) {
        this.setData({
            'recycleForm.serviceAgree': event.detail
        });
    },

    // 显示规则
    showRule(e) {
        let { type, id } = e.currentTarget.dataset;
        let { goldType, weight } = this.data.evaluateFormData.sellGoldForm;
        let url = '';
        // 预估金额说明
        if (type === 'ESTIMATE') {
            if (!weight) { weight = 0 }
            url = `/pages-cuilv/recycleEstimateNote/recycleEstimateNote?weight=${weight}&type=${goldType}`;
        }
        // 回收方式说明
        if (type === 'CALLWAY') {
            let key = 'recycle_method_explanation';
            url = `/pages-cuilv/picturePage/picturePage?key=${key}`;
        }
        // 服务条款说明
        if (type === 'AGREEMENT') {
            url = `/pages-cuilv/informationArticle/informationArticle?id=${id}`;
        }
        wx.navigateTo({ url });
    },

    // 表单数据验证
    validateForm() {
        // 填写订单数据
        let { address, serviceAgree, recycleWay } = this.data.recycleForm;
        // 验证表单
        let error = '';
        recycleWay || (error = '回收方式不能为空');  // 回收方式
        address || (error = '地址信息不能为空');  // 地址
        serviceAgree || (error = '请先同意服务协议');  // 服务协议
        if (error) {
            throw new Error(error);
        }
    },

    // 表单数据整理
    compressForm() {
        let { evaluateFormData, recycleForm } = this.data;
        // 第一页表单
        let { goldType, weight, images } = evaluateFormData.sellGoldForm;

        // 第二页表单
        let { recycleWay, address } = recycleForm;
        let backEndForm = transformAddressToCustomer(address);

        // 合并请求数据
        let form = {
            gold_type: goldType,
            weight,
            image_url: JSON.stringify(images),
            repo_type: recycleWay,
            ...backEndForm,
        };
        this.setData({ sendForm: form });
        this.addConditionParams();
    },

    // 根据条件追加请求数据
    addConditionParams() {
        let { dopositId, sendForm } = this.data;
        // 寄存订单回购
        if (dopositId) {
            Object.assign(sendForm, { deposit_id: dopositId });
        }
        // 传入本地appid
        let sourceAppId = wx.getAccountInfoSync().miniProgram.appId;
        if (sourceAppId) {
            Object.assign(sendForm, { source_appid: sourceAppId });
        }
        // 内嵌小程序标识
        const INLINEAPP = 2;
        Object.assign(sendForm, { order_source: INLINEAPP });
        this.setData({ sendForm });
    },

    // 提交表单
    async onSubmit() {
        this.compressForm();
        let { sendForm } = this.data;
        try {
            this.validateForm();
            let data = await api.hei.postOrder(sendForm);
            let repoNo = data.order && data.order.repo_no;
            app.globalData.evaluateFormData = {};
            let url =  `/pages-cuilv/recycleResultPage/recycleResultPage?id=1&orderNo=${repoNo}`;
            wx.redirectTo({ url });
        } catch (err) {
            console.log(err.code);
            if (err.code === 10086) {
                // 实名认证
                const { confirm } = await proxy.showModal({ title: '温馨提示', content: err.errMsg });
                if (confirm) {
                    wx.navigateTo({ url: '/pages-cuilv/verifyIdentity/verifyIdentity' });
                }
            } else {
                let title = err.message || err.errMsg || '提交失败';
                wx.showToast({ title, icon: 'none', });
            }
        }
    },

});
