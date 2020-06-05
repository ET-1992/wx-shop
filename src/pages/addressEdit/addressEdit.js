
import api from 'utils/api/index';
import { ADDRESS_KEY, LOCATION_KEY, CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
const app = getApp();
import { auth, getDistance } from 'utils/util';

Page({
    data: {
        title: 'addressEdit',
        type: 'update',  // 地址更新或添加
        typeToTitle: {
            'update': '地址编辑',
            'add': '地址添加',
            'orderEdit': '订单地址编辑',
        },  // 地址增/改标题
        form: [
            { key: 'name', value: '', label: '姓名' },
            { key: 'phone', value: '', label: '电话' },
            { key: 'address', value: [], label: '国家/地区', areacode: '' },
            { key: 'addressInfo', value: '', label: '详细地址' },
            { key: 'code', value: '', label: '邮政编码' },
        ],  // 页面表单数据
        formBackEnd: {
            'name': 'receiver_name',
            'phone': 'receiver_phone',
            'address': ['receiver_state', 'receiver_city', 'receiver_district'],
            'addressInfo': 'receiver_address',
            'code': 'receiver_zipcode',
        },  // 表单与后端地址键值对
        formWechat: {
            'name': 'userName',
            'phone': 'telNumber',
            'address': ['provinceName', 'cityName', 'countyName'],
            'addressInfo': 'detailInfo',
            'code': 'postalCode',
        },  // 表单与微信地址键值对
        isLoading: true,
        areaList: {},  // 省市区列表数据格式
        showAreaPanel: false,  // 省市区弹出框
        areacode: '',  // 省市区编码值
        originForm: '',  // 后端返回的地址表单
        mapList: [],  // 腾讯地图关键词搜索结果列表
        mapListPanel: false,  // 地图展示面板
        selectedMap: {},  // 地图选中项
        config: {},
        qqAddress: {},  // 腾讯地图逆地址解析结果
        qqLocation: {},  // 腾讯地图地址解析结果
        locationObj: {},  // 地址坐标对象
    },

    onLoad(params) {
        console.log(params);
        let { type, id = 0 } = params;
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            type,
            id,
            config,
        });
        this.setPage();
    },

    // 设置页面
    async setPage() {
        let { type = 'update', typeToTitle, config } = this.data;
        wx.setNavigationBarTitle({
            title: typeToTitle[type],
        });
        // if (config.offline_store_enable) {
        this.addFormItem();
        // }
        if (type === 'update') {
            this.getUpdateAddressInfo();
        } else if (type === 'orderEdit') {
            this.getOrderAddress();
        } else {
            this.setData({
                isLoading: false,
            });
        }
        // this.getAreaData();
    },

    // 表单添加门牌号
    addFormItem() {
        let { form, formBackEnd, formWechat } = this.data;
        let index = form.findIndex(item => item.key === 'addressInfo') + 1;
        let formItem = { key: 'houseNumber', value: '', label: '门牌号' };
        formBackEnd['houseNumber'] = 'room';
        formWechat['houseNumber'] = 'room';
        // 在详细地址后面插入
        form.splice(index, 0, formItem);
        this.setData({
            form,
            formBackEnd,
            formWechat,
        });
    },

    // 获取具体地址
    async getUpdateAddressInfo() {
        this.setData({ isLoading: true });
        let { id } = this.data;
        let data = await api.hei.getReceiverInfo({ receiver_id: id });
        this.setData({
            originForm: data.receiver,
        });
        this.showUpdateAddress();
    },

    // 在页面上展示具体地址
    showUpdateAddress() {
        let { form, originForm, formBackEnd } = this.data;
        let { latitude, longtitude } = originForm;
        // 遍历对应字段表
        for (let [k, v] of Object.entries(formBackEnd)) {
            // 遍历表单数组
            for (let elem of form.values()) {
                if (elem.key === k && Array.isArray(v)) {
                    // 地址
                    elem.value = v.map(item => originForm[item]);
                } else if (elem.key === k && !Array.isArray(v)) {
                    elem.value = originForm[v];
                }
            }
        }
        let areacode = originForm.receiver_areacode;
        this.setData({
            locationObj: { latitude, longitude: longtitude },
            form,
            areacode,
            isLoading: false,
        });
    },

    // 导入多门店两种地址
    getOrderAddress() {
        let location = wx.getStorageSync(LOCATION_KEY) || false;
        let address = wx.getStorageSync(ADDRESS_KEY) || {};
        if (location) {
            this.showOrderLocation();
        } else if (address.userName) {
            this.showOrderAddress();
        }
        this.setData({
            isLoading: false,
        });

    },

    // 展示多门店定位地址
    showOrderLocation() {
        let { form } = this.data;
        let locationObj = wx.getStorageSync(LOCATION_KEY) || {};
        let { address, location } = locationObj;
        let { lat, lng } = location;
        // let { adcode, province, city, district } = ad_info || {};
        // 表单地址选项
        let index = form.findIndex(item => item.key === 'address');
        // form[index].value = [province, city, district];
        // form[index].areacode = adcode;
        // 表单详细地址选项
        form[index + 1].value = address;
        this.setData({
            // areacode: adcode,
            form,
            locationObj: { latitude: lat, longitude: lng }
        });
    },

    // 展示多门店收货地址
    showOrderAddress() {
        let { form, formWechat } = this.data;
        let address = wx.getStorageSync(ADDRESS_KEY) || {};
        console.log('formWechat', formWechat);
        for (let [k, v] of Object.entries(formWechat)) {
            // 遍历表单数组
            for (let elem of form.values()) {
                if (elem.key === k && Array.isArray(v)) {
                    // 地址
                    elem.value = v.map(item => address[item]);
                } else if (elem.key === k && !Array.isArray(v)) {
                    elem.value = address[v];
                }
            }
        }
        let areacode = address.nationalCode;
        let { latitude, longitude } = address;
        this.setData({
            form,
            areacode,
            locationObj: { latitude, longitude }
        });
    },

    // 输入框变化
    onChange(e) {
        let { form } = this.data;
        let { detail, target: { dataset: { key }}} = e;
        let index = form.findIndex(item => {
            return item.key === key;
        });
        form[index]['value'] = detail;
        this.setData({
            form: form,
        });
    },

    // 联想地址输入框变化
    onAddressInfo: debounce(function(e) {
        let { detail } = e;
        if (detail) {
            this.searchAddress(detail);
        } else {
            this.setData({ mapListPanel: false });
        }
    }, 400, true),

    // 收起联想地址弹出框
    onCloseAddress() {
        this.setData({ mapListPanel: false });
    },

    // 联想地址请求
    async searchAddress(value) {
        let { form } = this.data;
        // 搜索地区
        let formCity = form[2].value[1];
        // 详细地址填入
        form[3].value = value;
        this.setData({
            mapListPanel: true,
            form: form,
        });
        let city = formCity || '广州';
        let keyword = value;
        let data = {
            key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            keyword: keyword,
            boundary: `region(${city})`,
        };
        let url = 'https://apis.map.qq.com/ws/place/v1/search';
        wx.request({
            url,
            data,
            success: (res) => {
                let list = res.data.data || [];
                let mapList = list.filter(item => item.type === 0) || [];
                this.setData({ mapList });
            },
            fail(error) {
                console.log('error', error);
            }
        });
    },

    // 选择联想地址框
    onSelectAddress(e) {
        let { mapList } = this.data;
        let { id } = e.currentTarget.dataset;
        let selectedMap = mapList.find((n) => {
            return n.id === id;
        });
        selectedMap = selectedMap || {};
        this.setData({
            selectedMap,
            mapListPanel: false,
        });
        this.updateAddressForm();
    },

    // 触发联想地址结果
    updateAddressForm() {
        let { selectedMap, form } = this.data;
        let { address, ad_info = {}} = selectedMap;
        let { adcode, province, city, district } = ad_info;
        // 表单地址选项
        form[2].value = [province, city, district];
        form[2].areacode = adcode;
        // 表单详细地址选项
        form[3].value = address;
        this.setData({
            areacode: adcode,
            form,
        });
        console.log('selectedMap', selectedMap);
    },

    // 删除地址表单
    async onDeleteForm() {
        wx.showLoading({
            title: '加载中',
        });
        let { id } = this.data;
        await api.hei.deleteReceiverInfo({ receiver_id: id });
        wx.hideLoading();
        wx.showModal({
            title: '温馨提示',
            content: '删除成功',
            showCancel: false,
            success: () => {
                wx.navigateBack();
            }
        });
    },

    // 保存地址表单
    async onConfirmForm() {
        let { type } = this.data;
        wx.showLoading({
            title: '加载中',
        });
        try {
            await this.parseLocationData();
            this.checkAddressForm();
            if (type === 'orderEdit') {
                // 确认多门店地址表单
                await this.confirmStoreAddress();
            } else {
                // 确定收货地址表单
                await this.confirmListAddress();
            }
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.message || error.errMsg || '提交失败',
                showCancel: false,
            });
        } finally {
            wx.hideLoading();
        }
    },

    // 确认多门店地址表单
    async confirmStoreAddress() {
        let finalForm = await this.saveStoreAddress();
        app.event.emit('setAddressListEvent', finalForm);
        wx.showModal({
            title: '温馨提示',
            content: '地址编辑成功',
            showCancel: false,
            success: () => wx.navigateBack(),
        });
    },

    // 保存多门店地址
    async saveStoreAddress() {
        let location = wx.getStorageSync(LOCATION_KEY) || false;
        let { form, formWechat, locationObj, qqLocation } = this.data;
        let { ad_info } = qqLocation;
        let { province, city, district } = ad_info;
        let index = form.findIndex(item => item.key === 'address');
        form[index].value = [province, city, district];
        let finalForm = {};
        // 遍历对应字段表
        for (let [k, v] of Object.entries(formWechat)) {
            // 遍历表单数组
            for (let elem of form.values()) {
                if (elem.key === k && Array.isArray(v)) {
                    // 地址
                    v.forEach((item, index) => { finalForm[item] = elem.value[index] });
                } else if (elem.key === k && !Array.isArray(v)) {
                    finalForm[v] = elem.value;
                }
            }
        }
        let { latitude, longitude } = locationObj;
        // 添加经纬度
        finalForm.latitude = latitude;
        finalForm.longitude = longitude;
        this.checkOrderAddress({ latitude, longitude });
        if (location) {
            // 定位信息完善为地址信息
            wx.setStorageSync(LOCATION_KEY, null);
        }
        wx.setStorageSync(ADDRESS_KEY, finalForm);
        return finalForm;
    },

    // 地址解析
    async parseAddressData() {
        let { form } = this.data;
        let address = form[2].value || [];
        let addressInfo = form[3].value;
        let addressStr = [...address, addressInfo].join('');
        let cityName = address[1];
        let data = {
            key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            address: addressStr,
            region: cityName,
        };
        let url = 'https://apis.map.qq.com/ws/geocoder/v1';
        try {
            let res = await proxy.request({ url, data });
            console.log('地址解析结果：', res);
            let resObj = {};
            if (res.data && res.data.status === 0) {
                ({ result: resObj } = res.data);
            }
            this.setData({
                qqAddress: resObj,
            });
        } catch (error) {
            console.log('地址解析错误', error);
            throw new Error('找不到该地址的地理位置');
        }
    },

    // 地址逆解析
    async parseLocationData() {
        let { latitude, longitude } = this.data.locationObj;
        let data = {
            key: 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            location: `${latitude},${longitude}`
        };
        let url = 'https://apis.map.qq.com/ws/geocoder/v1';
        try {
            let res = await proxy.request({ url, data });
            console.log('经纬度解析的结果：', res);
            if (res.data && res.data.status === 0) {
                let { result = {}} = res.data;
                this.setData({
                    qqLocation: result,
                });
            }
        } catch (error) {
            console.log('经纬度解析的错误', error);
            throw new Error('无法定位该地理位置');
        }
    },

    // 确定收货地址表单
    async confirmListAddress() {
        let { type = 'update', typeToTitle } = this.data;
        let modalContent = `${typeToTitle[type]}成功`;
        await this.submitListAddress();
        wx.showModal({
            title: '温馨提示',
            content: modalContent,
            showCancel: false,
            success: () => wx.navigateBack(),
        });

    },

    // 向后端提交地址请求
    async submitListAddress() {
        let { form, formBackEnd, areacode, type, id, qqLocation } = this.data;
        let { location, ad_info } = qqLocation;
        let { lat: latitude, lng: longitude } = location;
        let { province, city, district } = ad_info;
        let index = form.findIndex(item => item.key === 'address');
        form[index].value = [province, city, district];
        let finalForm = {};
        // 遍历对应字段表
        for (let [k, v] of Object.entries(formBackEnd)) {
            // 遍历表单数组
            for (let elem of form.values()) {
                if (elem.key === k && Array.isArray(v)) {
                    // 地址
                    v.forEach((item, index) => { finalForm[item] = elem.value[index] });
                } else if (elem.key === k && !Array.isArray(v)) {
                    finalForm[v] = elem.value;
                }
            }
        }
        let apiMethod = 'addReceiverInfo';
        // 省市区编号和地址ID
        finalForm.receiver_areacode = areacode;
        if (type === 'update') {
            // 地址编辑操作
            finalForm.receiver_id = id;
            apiMethod = 'updateReceiverInfo';
        }
        // 国家和是否默认地址
        finalForm.receiver_country = '';
        finalForm.receiver_default = 0;
        // 添加经纬度
        finalForm.latitude = latitude;
        finalForm.longtitude = longitude;  // 注意经度字段
        await api.hei[apiMethod](finalForm);
    },

    // 校验表单
    checkAddressForm() {
        let { form } = this.data;
        // 表单必填验证
        let success = form.every(item => item.key === 'houseNumber' || item.key === 'address' || item.value.length);
        if (!success) {
            throw new Error('请填写必要的信息');
        }
    },

    // 获取地区选择器数据
    async getAreaData() {
        let data = await api.hei.fetchRegionList();
        let { areaList } = data;
        this.setData({ areaList });
    },

    // 弹出地区级联选择器
    onShowArea() {
        this.setData({
            showAreaPanel: true,
        });
    },

    // 关闭地区级联选择器
    onCloseArea() {
        this.setData({
            showAreaPanel: false,
        });
    },

    // 提交地区级联选择器
    onConfirmArea(e) {
        let { form } = this.data;
        let { values = [] } = e.detail;
        // 级联ID
        let areacode = values[values.length - 1].code;
        // 更改地址数据
        let index = form.findIndex(item => item.key === 'address');
        form[index].value = values.map(item => item.name);
        form[index].areacode = areacode;
        // form[index + 1].value = '';
        this.setData({
            areacode,
            form,
        });
        this.onCloseArea();
    },

    // 打开微信定位获取详细地址
    async onChooseLocation() {
        let { form } = this.data;
        let data = await proxy.chooseLocation();
        let { address, name, latitude, longitude } = data;
        console.log('微信定位结果', data);
        let locationObj = { latitude, longitude };
        // 更改详细地址数据
        let index = form.findIndex(item => item.key === 'addressInfo');
        form[index].value = address + name;
        this.setData({
            form,
            locationObj,
        });
    },

    // 校验地址是否超出配送范围
    checkOrderAddress(obj) {
        let { latitude, longitude } = obj;
        let { currentStore } = app.globalData;
        console.log('currentStore', currentStore);
        if (!currentStore.latitude || !currentStore.longtitude) {
            throw new Error('获取门店信息失败');
        }
        let distance = getDistance(latitude, longitude, Number(currentStore.latitude), Number(currentStore.longtitude));
        if (!distance) {
            throw new Error('计算门店距离失败');
        }
        distance = Number(distance).toFixed(2);
        let rangeOut = false;
        if (currentStore.distance_limit) {
            rangeOut = Number(distance) >= currentStore.distance_limit;
        }
        if (rangeOut) {
            throw new Error('该地址超出门店所配送范围');
        }
        console.log(`门店范围校验通过，实际距离${distance}km，限制距离${currentStore.distance_limit}km`);
    },
});

// 防抖
function debounce(event, time, flag) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        if (flag && !timer) {
            event.apply(this, args);
        }
        timer = setTimeout(() => {
            event.apply(this, args);
        }, time);
    };
}
