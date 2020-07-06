const PAGELIST = [
    {
        id: 0, title: '订单列表',
        typeArray: [
            '全部类型',
            '直接变现',
            '自主择价',
        ],
        typeIndexToNum: [0, 1, 2],
        requestName: 'getOrderList', responseKey: 'orders'
    },
    {
        id: 1, title: '余额明细',
        typeArray: [
            '全部类型',
        ],
        typeIndexToNum: [0],
        requestName: 'getRepositList', responseKey: 'logs'
    },
    {
        id: 2, title: '寄存记录',
        typeArray: [
            '全部类型',
            '存入',
            '提取',
        ],
        typeIndexToNum: [0, 15, 151],
        requestName: 'getRepositList', responseKey: 'logs'
    },
];
import api from 'utils/api';
import { go } from 'utils/util';
import { REPO_STATUS } from 'constants/index';

Page({
    data: {
        title: 'listPage',
        isLoading: true,
        next_cursor: 0,
        typeIndex: 0, // 类型索引
        dateIndex: '', // 时间索引
        localPage: {}, // 页面主要内容
        listData: [], // 主要列表数据
        REPO_STATUS,
    },

    onLoad({ id }) {
        this.initPage(id);
    },

    go,

    // 初始化列表页面
    initPage(id) {
        let localPage = PAGELIST.find(item => {
            return item.id === Number(id);
        });
        if (!localPage) { return }
        wx.setNavigationBarTitle({
            title: localPage.title
        });
        this.setData({ localPage });
        this.resetOrderList();
    },

    // 合并请求API参数
    getParameters() {
        let { next_cursor, typeIndex, dateIndex, localPage } = this.data;
        let { id, typeIndexToNum } = localPage;
        let resObj = {
            cursor: next_cursor,
            date: dateIndex,
        };
        if (id === 0) {
            // 订单列表
            // 回购类型：变现/自主择价
            let PickerOrderType = typeIndex;
            Object.assign(resObj, {
                repo_type: PickerOrderType
            });
        } else if (id > 0) {
            // 寄存或回购具体订单
            let type = typeIndexToNum[typeIndex];
            // 具体回购类型
            const ORDER_TYPE = id;
            Object.assign(resObj, {
                repo_type: ORDER_TYPE,
                type,
            });
        }
        this.setData({ resObj });
    },

    // 请求列表数据
    async loadListData() {
        this.getParameters();
        let { resObj, localPage, listData } = this.data;
        let { requestName, responseKey } = localPage;

        let data = await api.hei[requestName](resObj);
        listData.push(...data[responseKey]);
        this.setData({
            next_cursor: data.next_cursor,
            listData,
            isLoading: false
        });
        wx.stopPullDownRefresh();
    },

    // 上拉刷新
    onPullDownRefresh() {
        this.resetOrderList();
    },

    // 下拉加载更多
    onReachBottom() {
        console.log('加载更多');
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.loadListData();
    },

    // 更新列表数据
    updateData(e) {
        let { name, value } = e.detail;
        // 类型或时间选择框
        // typeindex
        // dateIndex
        this.setData({
            [name]: value,
        });
        this.resetOrderList();
    },

    // 重置列表数据
    resetOrderList() {
        this.setData({
            listData: [],
            isLoading: true,
            next_cursor: 0
        });
        this.loadListData();
    }
});
