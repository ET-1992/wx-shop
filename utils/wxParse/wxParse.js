/* eslint-disable */
/**
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */

/**
 * utils函数引入
 **/

let showdown = require('./showdown.js');
let HtmlToJson = require('./html2json.js');
/**
 * 配置及公有属性
 **/
let realWindowWidth = 0;
let realWindowHeight = 0;
wx.getSystemInfo({
    success: function (res) {
        realWindowWidth = res.windowWidth;
        realWindowHeight = res.windowHeight;
    }
});
/**
 * 主函数入口区
 **/
function wxParse(bindName = 'wxParseData', type = 'html', data = '<div class="color:red;">数据不能为空</div>', target, imagePadding) {
    let that = target;
    let transData = {};// 存放转化后的数据
    if (type == 'html') {
        transData = HtmlToJson.html2json(data, bindName);
    } else if (type == 'md' || type == 'markdown') {
        let converter = new showdown.Converter();
        let html = converter.makeHtml(data);
        transData = HtmlToJson.html2json(html, bindName);
    }
    transData.view = {};
    transData.view.imagePadding = 0;
    if (typeof (imagePadding) !== 'undefined') {
        transData.view.imagePadding = imagePadding;
    }
    let bindData = {};
    bindData[bindName] = transData;
    that.setData(bindData);
    if (!that.wxParseImgLoad) {
  	that.wxParseImgLoad = wxParseImgLoad;
    }

    if (!that.wxParseImgTap) {
  	that.wxParseImgTap = wxParseImgTap;
    }
}
// 图片点击事件
function wxParseImgTap(e) {
    console.log(e);
    let that = this;
    let nowImgUrl = e.target.dataset.src;
    let tagFrom = e.target.dataset.from;
    if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: that.data[tagFrom].imageUrls // 需要预览的图片http链接列表
      })
    }
}

/**
 * 图片视觉宽高计算函数区
 **/
function wxParseImgLoad(e) {
    let that = this;
    let tagFrom = e.target.dataset.from;
    let idx = e.target.dataset.idx;
    if (typeof (tagFrom) !== 'undefined' && tagFrom.length > 0) {
        calMoreImageInfo(e, idx, that, tagFrom);
    }
}
// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
    let temData = that.data[bindName];
    if (!temData || temData.images.length == 0) {
        return;
    }
    let temImages = temData.images;
    // 因为无法获取view宽度 需要自定义padding进行计算，稍后处理
    let recal = wxAutoImageCal(e.detail.width, e.detail.height, that, bindName);
    // temImages[idx].width = recal.imageWidth;
    // temImages[idx].height = recal.imageheight;
    // temData.images = temImages;
    // var bindData = {};
    // bindData[bindName] = temData;
    // that.setData(bindData);
    let index = temImages[idx].index;
    let key = `${bindName}`;
    for (let i of index.split('.')) key += `.nodes[${i}]`;
    let keyW = key + '.width';
    let keyH = key + '.height';
    that.setData({
        [keyW]: Number(recal.imageWidth),
        [keyH]: Number(recal.imageheight),
    });
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight, that, bindName) {
    // 获取图片的原始长宽
    let windowWidth = 0,
        windowHeight = 0;
    let autoWidth = 0,
        autoHeight = 0;
    let results = {};
    let padding = that.data[bindName].view.imagePadding;
    windowWidth = realWindowWidth - 2 * padding;
    windowHeight = realWindowHeight;
    // 判断按照那种方式进行缩放
    // console.log("windowWidth" + windowWidth);
    if (originalWidth >= windowWidth) { // 在图片width大于手机屏幕width时候
        autoWidth = windowWidth;
        // console.log("autoWidth" + autoWidth);
        autoHeight = Math.round((autoWidth * originalHeight) / originalWidth);
        // console.log("autoHeight" + autoHeight);
        results.imageWidth = Number(autoWidth);
        results.imageheight = Number(autoHeight);
    } else { // 否则展示原来的数据
        results.imageWidth = Number(originalWidth);
        results.imageheight = Math.round(originalHeight);
    }
    return results;
}

function wxParseTemArray(temArrayName, bindNameReg, total, that) {
    let array = [];
    let temData = that.data;
    let obj = null;
    for (let i = 0; i < total; i++) {
        let simArr = temData[bindNameReg + i].nodes;
        array.push(simArr);
    }

    temArrayName = temArrayName || 'wxParseTemArray';
    obj = JSON.parse('{"' + temArrayName + '":""}');
    obj[temArrayName] = array;
    that.setData(obj);
}

/**
 * 配置emojis
 *
 */

function emojisInit(reg = '', baseSrc = '/wxParse/emojis/', emojis) {
    HtmlToJson.emojisInit(reg, baseSrc, emojis);
}

module.exports = {
    wxParse: wxParse,
    wxParseTemArray: wxParseTemArray,
    emojisInit: emojisInit
};

