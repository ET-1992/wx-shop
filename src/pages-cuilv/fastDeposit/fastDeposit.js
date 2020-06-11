import { go, formatTime, getUserInfo } from 'utils/util';
import api from 'utils/api';
import { showModal } from 'utils/wxp';

Page({
    data: {
        title: 'fastDeposit',
        current_user: {},
        isLoading: true,
        isSubLoading: true,
        next_cursor: 0,
        goldPrice: '暂无',  // 实时金价
        goldWeight: '0',  // 存进总额
        orders: [],  // 订单列表
        typeArray: ['全部类型', '寄存记录', '回购记录', '发货记录'],
        typeIndex: 0, // 类型
        dateIndex: '', // 时间
        recyclData: {},  // 跳转回购数据
        miniData: {},  // 打包好的跳转回购数据
    },
    go,

    onShow() {
        // console.log(params);
        this.resetOrderList();
    },

    // 改变picker选择框
    bindPickerChange: function (e) {
        let { detail: { value }, currentTarget: { dataset: { name }}} = e;
        if (value === this.data[name]) { return }
        // name包括typeIndex、dateIndex
        this.setData({
            [name]: value,
        });
        // console.log('picker发送选择改变，携带值为', value);
        this.resetOrderList();
    },

    // 重置picker选择框
    bingPickerCancel: function (e) {
        let { name } = e.currentTarget.dataset;
        let value;
        if (name === 'dateIndex') {
            value = '';  // 重置“全部时间”
        } else {
            value = 0;  // 重置“全部类型”
        }
        if (value === this.data[name]) { return }
        this.setData({
            [name]: value,
        });
        this.resetOrderList();
    },

    // 下拉加载更多
    onReachBottom: function () {
        console.log('加载更多');
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadOrder();
    },

    // 加载订单数据
    async loadOrder() {
        const { next_cursor, typeIndex, dateIndex } = this.data;
        const data = await api.hei.getDepositOrderList({
            cursor: next_cursor,
            type: typeIndex,
            time: dateIndex
        });
        let { base_price: goldPrice, weight: goldWeight, datas: order, current_user } = data;
        // 遍历转换时间戳
        order = order.map(x => {
            x.time = formatTime(new Date(x.time * 1000));
            return x;
        });

        const newOrders = this.data.orders.concat(order);
        this.setData({
            current_user,
            goldPrice,
            goldWeight,
            orders: newOrders,
            isLoading: false,
            isSubLoading: false,
            next_cursor: data.next_cursor,
        });
    },

    // 确定收货
    async confirmDelivery(e) {
        let { no } = e.currentTarget.dataset;
        try {
            const data = await api.hei.confirmDeposit({
                deposit_order_no: no
            });
            wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
            });
            this.resetOrderList();
        } catch (err) {
            // console.log(err);
            wx.showToast({
                title: err.errMsg || '出错了',
                icon: 'none',
                duration: 1000
            });
        }
    },

    // 我要回收
    async onRecycleBtn(e) {
        // 获取传递参数
        // const { confirm } = await showModal({
        //     title: '温馨提示',
        //     content: '您需要通过哪种方式进行回收操作',
        //     cancelText: '独立程序',
        //     confirmText: '当前程序',
        // });
        this.setData({
            recyclData: e.currentTarget.dataset
        });
        this.compressData();
        this.goToCLPages();
        // if (confirm) {
        //     this.goToCLPages();
        // } else {
        //     this.goOtherApp();
        // }
    },

    // 打包传递数据
    compressData() {
        let { recyclData, current_user } = this.data;
        let user = getUserInfo() || current_user;
        let { appid: shop_appid, openid: shop_openid } = user;
        let { id: deposit_id, weight, img: img_url, no: order_no } = recyclData;

        let miniData = { shop_appid, shop_openid, deposit_id, weight, img_url, order_no };
        this.setData({ miniData });
    },

    // 本程序跳转回购
    goToCLPages() {
        let { miniData } = this.data;
        wx.navigateTo({
            url: '/pages-cuilv/recycleEvaluate/recycleEvaluate',
            success: function(res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', { miniData });
            }
        });
    },

    // 跳转到独立回购程序
    // goOtherApp() {
    //     const CUILVHUIGOU = 'wx055447336d8b8d74';
    //     let { miniData } = this.data;
    //     wx.navigateToMiniProgram({
    //         appId: CUILVHUIGOU,
    //         path: 'pages/home/evaluate/evaluate',
    //         extraData: { miniData },
    //         envVersion: 'trial',
    //     });
    // },

    // 重置订单列表数据
    resetOrderList() {
        this.setData({
            isSubLoading: true,
            orders: [],
            next_cursor: 0
        });
        this.loadOrder();
    },

    // 发送formid
    async submitFormId(e) {
        const data = await api.hei.submitFormId({
            form_id: e.detail.formId,
        });
        console.log('发送formid', data);
    },
});
