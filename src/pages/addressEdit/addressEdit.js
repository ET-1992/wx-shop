
import api from 'utils/api/index';

Page({
    data: {
        title: 'addressEdit',
        type: 'update',  // 地址更新或添加
        typeToTitle: {
            'update': '地址编辑',
            'add': '地址添加',
        },  // 地址增/改标题
        form: [
            { key: 'name', value: '', label: '姓名' },
            { key: 'phone', value: '', label: '电话' },
            { key: 'address', value: [], label: '国家/地区', areacode: '' },
            { key: 'addressInfo', value: '', label: '详细地址' },
            { key: 'code', value: '', label: '邮政编码' },
        ],  // 页面表单数据
        keyPairs: {
            'name': 'receiver_name',
            'phone': 'receiver_phone',
            'address': ['receiver_state', 'receiver_city', 'receiver_district'],
            'addressInfo': 'receiver_address',
            'code': 'receiver_zipcode',
        },  // 前后端数据键对
        isLoading: true,
        areaList: {},  // 省市区列表数据格式
        showAreaPanel: false,  // 省市区弹出框
        areacode: '',  // 省市区编码值
        originForm: '',  // 后端返回的地址表单
        mapList: [],  // 腾讯地图搜索结果列表
        mapListPanel: false,  // 地图展示面板
        selectedMap: {},  // 地图选中项
    },

    onLoad(params) {
        console.log(params);
        let { type, id = 0 } = params;
        this.setData({
            type,
            id,
        });
        this.setPage();
    },

    // 设置页面
    async setPage() {
        let { type = 'update', id, typeToTitle } = this.data;
        wx.setNavigationBarTitle({
            title: typeToTitle[type],
        });
        if (id) {
            this.getAddressInfo();
        } else {
            this.setData({
                isLoading: false,
            });
        }
        this.getAreaData();
    },

    // 获取具体地址
    async getAddressInfo() {
        this.setData({ isLoading: true });
        let { id } = this.data;
        let data = await api.hei.getReceiverInfo({ receiver_id: id });
        this.setData({
            originForm: data.receiver,
        });
        this.showFormData();
    },

    // 在页面上展示具体地址
    showFormData() {
        let { form, originForm, keyPairs } = this.data;
        // 遍历对应字段表
        for (let [k, v] of Object.entries(keyPairs)) {
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
            form,
            areacode,
            isLoading: false,
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

    // 收起展示面板
    onCloseAddress() {
        this.setData({ mapListPanel: false });
    },

    // 详细地址输入框变化
    onAddressInfo: debounce(function(e) {
        let { detail } = e;
        if (detail) {
            this.searchAddress(detail);
        } else {
            this.setData({ mapListPanel: false });
        }
    }, 400, true),

    // 搜索地址请求
    async searchAddress(value) {
        let { form } = this.data;
        let formCity = form[2].value[1];
        this.setData({ mapListPanel: true });
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

    // 点击搜索地图单项
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

    // 点击详细地址更改表单数据
    updateAddressForm() {
        let { selectedMap, form } = this.data;
        let { address, ad_info = {}} = selectedMap;
        let { adcode, province, city, district } = ad_info;
        // 表单地区
        form[2].value = [province, city, district];
        form[2].areacode = adcode;
        // 表单详细地址
        form[3].value = address;
        this.setData({
            areacode: adcode,
            form,
        });
        console.log('selectedMap', selectedMap);
    },

    // 保存表单
    async onSaveForm() {
        try {
            this.checkForm();
            await this.sendForm();
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.message || error.errMsg || '提交失败',
                showCancel: false,
            });
        }
    },

    // 发送表单数据
    async sendForm() {
        let { form, keyPairs, areacode, type, id } = this.data;
        let finalForm = {};
        // 遍历对应字段表
        for (let [k, v] of Object.entries(keyPairs)) {
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
        let modalContent = '地址添加成功';
        // 省市区编号和地址ID
        finalForm.receiver_areacode = areacode;
        if (type === 'update') {
            // 更改地址
            finalForm.receiver_id = id;
            apiMethod = 'updateReceiverInfo';
            modalContent = '地址修改成功';
        }
        // 国家和是否默认地址
        finalForm.receiver_country = '';
        finalForm.receiver_default = 0;
        await api.hei[apiMethod](finalForm);
        wx.showModal({
            title: '温馨提示',
            content: modalContent,
            showCancel: false,
            success: () => wx.navigateBack(),
        });
    },

    // 删除地址表单
    async onDeleteForm() {
        let { id } = this.data;
        await api.hei.deleteReceiverInfo({ receiver_id: id });
        wx.showModal({
            title: '温馨提示',
            content: '删除成功',
            showCancel: false,
            success: () => {
                wx.navigateBack();
            }
        });

    },

    // 获取级联选择器数据
    async getAreaData() {
        let data = await api.hei.fetchRegionList();
        let { areaList } = data;
        this.setData({ areaList });
    },

    // 校验表单
    checkForm() {
        let { form } = this.data;
        let success = form.every(item => item.value.length);
        if (!success) {
            throw new Error('请填写完整的地址信息');
        }
    },

    // 弹出级联选择器
    onShowArea() {
        this.setData({
            showAreaPanel: true,
        });
    },

    // 关闭级联选择器
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
        form[2].value = values.map(item => item.name);
        form[2].areacode = areacode;
        this.setData({
            areacode,
            form,
        });
        this.onCloseArea();
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
