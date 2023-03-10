
import api from 'utils/api/index';
import { ADDRESS_KEY, LOCATION_KEY, CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
const app = getApp();
import { checkBeyondDistance, auth } from 'utils/util';

Page({
    data: {
        config: {},
        isLoading: true,
        // 当前页面类型
        type: 'update',
        // 页面标题映射
        typeToTitle: {
            'update': '地址编辑',
            'add': '地址添加',
            'orderEdit': '订单地址编辑',
        },
        // 映射页面表单
        form: [
            { key: 'name', value: '', label: '姓名' },
            { key: 'phone', value: '', label: '电话' },
            { key: 'address', value: [], label: '国家/地区', areacode: '' },
            { key: 'addressInfo', value: '', label: '详细地址' },
            { key: 'houseNumber', value: '', label: '门牌号' },
            { key: 'code', value: '', label: '邮政编码' },
        ],
        // 映射后端数据
        formBackEnd: {
            'name': 'receiver_name',
            'phone': 'receiver_phone',
            'address': ['receiver_state', 'receiver_city', 'receiver_district'],
            'addressInfo': 'receiver_address',
            'houseNumber': 'room',
            'code': 'receiver_zipcode',
        },
        // 映射微信表单
        formWechat: {
            'name': 'userName',
            'phone': 'telNumber',
            'address': ['provinceName', 'cityName', 'countyName'],
            'addressInfo': 'detailInfo',
            'houseNumber': 'room',
            'code': 'postalCode',
        },
        qqAddress: {},  // 腾讯地图逆地址解析结果
        qqLocation: {},  // 腾讯地图地址解析结果
        // 当前地址定位
        locationObj: {
            latitude: '',
            longitude: '',
        },
    },

    onLoad(params) {
        let { type = 'update', id = 0 } = params;
        const config = wx.getStorageSync(CONFIG);
        this.setData({ type, id, config, });
        this.loadPage();
    },

    // 设置和渲染页面
    async loadPage() {
        let { type, typeToTitle } = this.data;
        wx.setNavigationBarTitle({
            title: typeToTitle[type],
        });
        if (type === 'update') {
            await this.showUpdateAddress();
        } else if (type === 'orderEdit') {
            this.showOrderAddress();
        }
        this.setData({
            isLoading: false,
        });
    },

    // 展示待更新地址
    async showUpdateAddress() {
        this.setData({ isLoading: true });
        let { id, formBackEnd } = this.data;
        let data = await api.hei.getReceiverInfo({ receiver_id: id });
        let { receiver: originFormData } = data;
        // 注意后端经度字段
        let resForm = this.transformFrontEnd(originFormData, formBackEnd);
        let { latitude, longtitude: longitude } = originFormData;
        this.setData({
            locationObj: { latitude, longitude },
            form: resForm,
        });
    },

    // 展示多门店地址
    showOrderAddress() {
        let { form, formWechat } = this.data,
            locationObj = {},
            LocationStorage = wx.getStorageSync(LOCATION_KEY) || false,
            addressStorage = wx.getStorageSync(ADDRESS_KEY) || {};
        if (LocationStorage) {
            // 展示定位地址
            let { address, location: { lat, lng }} = LocationStorage;
            // 手动录入详细地址
            let index = form.findIndex(item => item.key === 'addressInfo');
            form[index].value = address;
            locationObj = { latitude: lat, longitude: lng };
        } else if (addressStorage.userName) {
            // 展示收货地址
            form = this.transformFrontEnd(addressStorage, formWechat);
            let { latitude, longitude } = addressStorage;
            locationObj = { latitude, longitude };
        }
        this.setData({
            form,
            locationObj,
        });
    },

    // 输入框变化
    onInputChange(e) {
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
                await this.confirmStoreAddress();
            } else {
                await this.confirmListAddress();
            }
        } catch (error) {
            console.log('error', error);
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
        let { form, formWechat, locationObj, qqLocation: { ad_info }} = this.data;
        let { currentStore } = app.globalData;
        let location = wx.getStorageSync(LOCATION_KEY) || false;
        let { province, city, district } = ad_info;
        // 手动填入省市区
        let index = form.findIndex(item => item.key === 'address');
        form[index].value = [province, city, district];
        // 整理保存信息
        let finalForm = this.transformOthers(formWechat);
        Object.assign(finalForm, locationObj);
        console.log('finalForm', finalForm);
        // 校验距离范围
        let { latitude, longtitude: longitude, distance_limit } = currentStore;
        checkBeyondDistance(locationObj, { longitude, latitude }, distance_limit);
        if (location) {
            // 定位信息完善为地址信息
            wx.setStorageSync(LOCATION_KEY, null);
        }
        wx.setStorageSync(ADDRESS_KEY, finalForm);
        return finalForm;
    },

    // 地址解析
    async parseAddressData() {
        let { form, config } = this.data;
        let index = form.findIndex(item => item.key === 'address');
        let address = form[index].value || [],
            addressInfo = form[index + 1].value;
        // 城市地址
        let cityName = address[1],
            addressStr = [...address, addressInfo].join('');
        let url = 'https://apis.map.qq.com/ws/geocoder/v1',
            data = {
                key: config.mapKey || 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
                address: addressStr,
                region: cityName,
            };
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
        let { config, locationObj: { latitude, longitude }} = this.data;
        let url = 'https://apis.map.qq.com/ws/geocoder/v1',
            data = {
                key: config.mapKey || 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
                location: `${latitude},${longitude}`
            };
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
        let { form, formBackEnd, type, id, qqLocation: { location, ad_info }} = this.data;
        let { lat: latitude, lng: longitude } = location,
            { province, city, district } = ad_info;
        // 手动填入省市区
        let index = form.findIndex(item => item.key === 'address');
        form[index].value = [province, city, district];
        let finalForm = this.transformOthers(formBackEnd);
        let apiMethod = 'addReceiverInfo';
        if (type === 'update') {
            // 地址更新
            Object.assign(finalForm, { receiver_id: id });
            apiMethod = 'updateReceiverInfo';
        }
        let addForm = {
            receiver_country: '',
            receiver_default: 0,
            // 注意后端经度字段
            longtitude: longitude,
            latitude,
        };
        Object.assign(finalForm, addForm);
        await api.hei[apiMethod](finalForm);
    },

    // 校验表单
    checkAddressForm() {
        let { form } = this.data;
        // 表单必填验证
        let success = form.every(item => {
            if (item.key === 'houseNumber' || item.key === 'code' || item.key === 'address' || item.value.length) {
                return true;
            }
            return false;
        });
        if (!success) {
            throw new Error('请填写必要的信息');
        }
    },

    // 打开微信定位获取详细地址
    async onChooseLocation() {
        let { form } = this.data;
        try {
            const res = await auth({ scope: 'scope.userLocation', ctx: this, isFatherControl: true });
            if (res) {
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
            }
        } catch (e) {
            const { platform, locationAuthorized, locationEnabled } = wx.getSystemInfoSync();
            console.log(platform, 'platform');
            console.log(locationAuthorized, 'locationAuthorized');
            console.log(locationEnabled, 'locationEnabled');
            console.log(e);
            if (platform !== 'devtools' && (!locationEnabled || !locationAuthorized)) {
                await proxy.showModal({
                    title: '温馨提示',
                    content: '请检查手机定位是否开启、是否允许微信使用手机定位',
                    showCancel: false
                });
                return;
            }
        }
    },

    // 表单FORM转换成微信/后端字段
    transformOthers(rule) {
        let finalForm = {},
            { form } = this.data;
        for (const key in rule) {
            if (rule.hasOwnProperty(key)) {
                const ruleItem = rule[key];
                form.forEach(formItem => {
                    if (formItem.key === key) {
                        if (Array.isArray(ruleItem)) {
                            ruleItem.forEach((item, index) => {
                                finalForm[item] = formItem.value[index];
                            });
                        } else {
                            finalForm[ruleItem] = formItem.value;
                        }
                    }
                });
            }
        }
        console.log('form', form);
        console.log('finalForm', finalForm);
        return finalForm;
    },

    // 地址转换成表单FORM
    transformFrontEnd(origin, rule) {
        let { form } = this.data;
        console.log('form', form);
        for (const key in rule) {
            if (rule.hasOwnProperty(key)) {
                const ruleItem = rule[key];
                form.forEach(formItem => {
                    if (formItem.key === key) {
                        if (Array.isArray(ruleItem)) {
                            formItem.value = ruleItem.map(item => origin[item]);
                        } else {
                            formItem.value = origin[ruleItem];
                        }
                    }
                });
            }
        }
        console.log('finalForm', form);
        return form;
    },

    // 授权取消
    onAuthModalCancel() {
        console.log('取消授权');
        this.setData({
            'authModal.isShowModal': false
        });
    },

    // 授权确认
    onAuthModalConfirm() {
        this.setData({
            'authModal.isShowModal': false
        });
    },
});
