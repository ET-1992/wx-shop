// import { api } from "peanut-all";

import { apis, host } from "./api";
import { USER_KEY, CONFIG } from "../../constants/index";

const {api} = require("peanut-all");
console.log("pai", api);

function globalSuccessFnc({ res, options }) {
  const { data, statusCode, profile, header, cookies } = res;
  const { errcode, errmsg } = data;
  const { config, current_user } = data;
  const app = getApp();

  if (config) {
    wx.setStorageSync(CONFIG, config);
    app && app.globalData && (app.globalData.config = config);
    app.globalData.currency = config.currency || "CNY";
    app.globalData.currency_sign = config.currency_sign || "￥";
  }
  if (current_user) {
    wx.setStorageSync(USER_KEY, current_user);
    app && app.globalData && (app.globalData.current_user = current_user);
  }
}

function globalFailFnc({ res, options }) {
  const { data, statusCode, profile, header, cookies } = res;
  const { errcode, errmsg } = data;

  if (statusCode.toString().slice(0, 2) === "50") {
    wx.navigateTo({
      url: "/pages/errorPage/errorPage",
    });
  }

  if (errcode === "bind_required") {
    const app = getApp();
    const { bindWebApiWhite } = app.globalData;
    if (bindWebApiWhite.indexOf(options.path) === -1) {
      wx.showModal({
        title: "温馨提示",
        content: "继续浏览请先绑定手机号",
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: "/pages/bindWeb/bindWeb",
            });
          }
        },
      });
    }
  }
}

// 全局API携带参数
const globalParmasFnc = () => {
  const app = getApp();
  const {
    currentMachine,
    currentStore,
    storeKey,
    pageKey,
    launchOptions = {},
  } = app.globalData;

  let fucObj = {
      page_key: pageKey,
      scene: launchOptions.scene,
    },
    machineId = currentMachine && currentMachine.id,
    storeId = currentStore && currentStore.id;

  if (machineId || storeId) {
    let store_id = storeKey === "machine" ? machineId : storeId;
    Object.assign(fucObj, { store_id });
  }
  return fucObj;
};

api.config({ apis, host, globalSuccessFnc, globalFailFnc, globalParmasFnc });

export default api;
