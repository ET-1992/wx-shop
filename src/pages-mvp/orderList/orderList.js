import api from "utils/api";
import { ORDER_STATUS_TEXT, MAGUA_ORDER_STATUS_TEXT } from "constants/index";
import { valueToText } from "utils/util";

const app = getApp();

const o = {
  magua: MAGUA_ORDER_STATUS_TEXT,
};

const D_ORDER_STATUS_TEXT =
  o[app.globalData.defineTypeGlobal] || ORDER_STATUS_TEXT;

const dataStatus = D_ORDER_STATUS_TEXT.filter((item) => {
  const o = [1, 10, 2, 3, 5, 4, 1010, 1011];
  return o.indexOf(item.value) > -1;
});

dataStatus.unshift({ text: "全部", value: null });

console.log(dataStatus);

Page({
  data: {
    orders: [
      {
        thumbnail:
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
        title:
          "无线吸拖吸尘器，26000Pa大吸无线吸拖吸尘器，26000Pa大吸力…无线吸拖吸尘器，26000Pa大吸力",
        sku_property_names: "",
        statusText: "待付款",
        status: 1,
        price: "1321",
        category:
          "白色/型号一/白色/型号一/白色/型号一顶故事梗概大姑的风格复古风的观点",
        categoryNum: 1,
      },
      {
        thumbnail:
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
        title:
          "无线吸拖吸尘器，26000Pa大吸无线吸拖吸尘器，26000Pa大吸力…无线吸拖吸尘器，26000Pa大吸力",
        sku_property_names: "",
        statusText: "待发货",
        status: 2,
        price: "1321",
        category:
          "白色/型号一/白色/型号一/白色/型号一顶故事梗概大姑的风格复古风的观点",
        categoryNum: 1,
      },
      {
        thumbnail:
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
        title:
          "无线吸拖吸尘器，26000Pa大吸无线吸拖吸尘器，26000Pa大吸力…无线吸拖吸尘器，26000Pa大吸力",
        sku_property_names: "",
        statusText: "已发货",
        status: 3,
        price: "1321",
        category:
          "白色/型号一/白色/型号一/白色/型号一顶故事梗概大姑的风格复古风的观点",
        categoryNum: 1,
      },
      {
        thumbnail:
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
        title:
          "无线吸拖吸尘器，26000Pa大吸无线吸拖吸尘器，26000Pa大吸力…无线吸拖吸尘器，26000Pa大吸力",
        sku_property_names: "",
        statusText: "已完成",
        status: 4,
        price: "1321",
        category:
          "白色/型号一/白色/型号一/白色/型号一顶故事梗概大姑的风格复古风的观点",
        categoryNum: 1,
      },
      {
        thumbnail:
          "http://cdn2.wpweixin.com/wp-content/uploads/sites/371/2022/04/1649322238-%E9%99%B6%E7%84%B6%E8%BD%A9.jpg?imageMogr2/auto-orient/thumbnail/!540x540r/gravity/Center/crop/540x540/quality/70|watermark/1/image/aHR0cDovL2NkbjIud3B3ZWl4aW4uY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9zaXRlcy8zNzEvMjAyMi8wMS8xNjQyMDU4NDQ3LUdyb3VwLTEyOS5wbmc=/dx/0/dy/0/ws/1#",
        title:
          "无线吸拖吸尘器，26000Pa大吸无线吸拖吸尘器，26000Pa大吸力…无线吸拖吸尘器，26000Pa大吸力",
        sku_property_names: "",
        statusText: "订单已取消",
        status: 5,
        price: "1321",
        category:
          "白色/型号一/白色/型号一/白色/型号一顶故事梗概大姑的风格复古风的观点",
        categoryNum: 1,
      },
    ],
    next_cursor: 0,
    activeIndex: 0,
    isRefresh: true,
    navbarListData: dataStatus,
    selectedStatus: null,
  },

  async loadOrders() {
    const { next_cursor, isRefresh, orders, selectedStatus } = this.data;
    const queryOption = { cursor: next_cursor };
    if (selectedStatus) {
      queryOption.status = selectedStatus;
    }
    if (isRefresh) {
      wx.showLoading();
    }
    const data = await api.hei.fetchOrderList(queryOption);
    const formatedOrders = data.orders.map((order) => {
      const statusCode = Number(order.status);
      order.statusCode = statusCode;
      order.statusText = valueToText(D_ORDER_STATUS_TEXT, Number(order.status));
      order.productCount = order.items.reduce((count, item) => {
        return count + Number(item.quantity);
      }, 0);
      return order;
    });

    const newOrders = isRefresh
      ? formatedOrders
      : orders.concat(formatedOrders);
    this.setData({
      orders: newOrders,
      isRefresh: false,
      next_cursor: data.next_cursor,
      config: data.config,
    });

    wx.hideLoading();
    console.log(this.data);
  },

  changeNavbarList(ev) {
    const { index, value } = ev.detail;
    this.setData({
      selectedStatus: value,
      activeIndex: index,
      isRefresh: true,
      next_cursor: 0,
    });
    // this.loadOrders();
  },

  async onLoad({ status }) {},

  async onPullDownRefresh() {
    this.setData({ isRefresh: true, next_cursor: 0 });
    await this.loadOrders();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    const { next_cursor } = this.data;
    if (!next_cursor) {
      return;
    }
    this.loadOrders();
  },

  onConfirmOrder(ev) {
    const { orderNo, orderIndex } = ev.detail;
    const updateData = {};
    updateData[`orders[${orderIndex}].statusCode`] = 4;
    updateData[`orders[${orderIndex}].status`] = 4;
    updateData[`orders[${orderIndex}].statusText`] = valueToText(
      D_ORDER_STATUS_TEXT,
      4
    );
    this.setData(updateData);
  },

  onPayOrder(ev) {
    const { orderNo, orderIndex } = ev.detail;
    const updateData = {};
    updateData[`orders[${orderIndex}].statusCode`] = 2;
    updateData[`orders[${orderIndex}].status`] = 2;
    updateData[`orders[${orderIndex}].statusText`] = valueToText(
      D_ORDER_STATUS_TEXT,
      2
    );
    this.setData(updateData);
  },
  onCloseOrder(ev) {
    const { orderNo, orderIndex } = ev.detail;
    console.log(orderIndex);
    const updateData = {};
    updateData[`orders[${orderIndex}].statusCode`] = 7;
    updateData[`orders[${orderIndex}].status`] = 7;
    updateData[`orders[${orderIndex}].statusText`] = valueToText(
      D_ORDER_STATUS_TEXT,
      7
    );
    this.setData(updateData);
  },
});
