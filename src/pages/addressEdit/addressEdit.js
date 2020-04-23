
import api from 'utils/api/index';

Page({
    data: {
        title: 'addressEdit',
        type: 'update',  // 地址更新或添加
        form: [
            { key: 'name', value: '', label: '姓名' },
            { key: 'phone', value: '', label: '电话' },
            { key: 'address', value: '', label: '国家/地区', areacode: '' },
            { key: 'addressInfo', value: '', label: '详细地址' },
            { key: 'code', value: '', label: '邮政编码' },
        ],
        isLoading: false,
        areaList: {},
        showAreaPanel: false,
        areacode: '',
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
        let { type = 'update', id } = this.data;
        const typeToTitle = {
            'update': '地址编辑',
            'add': '地址添加',
        };
        wx.setNavigationBarTitle({
            title: typeToTitle[type],
        });
        if (id) {
            this.getAddressInfo();
        }
        this.getAreaData();
    },

    // 获取具体地址
    async getAddressInfo() {
        this.setData({ isLoading: true });
        let { id, form } = this.data;
        let data = await api.hei.getReceiverInfo({ receiver_id: id });
        const {
            receiver_name,
            receiver_phone,
            receiver_country,
            receiver_state,
            receiver_city,
            receiver_district,
            receiver_address,
            receiver_zipcode,
            receiver_default,
            receiver_areacode
        } = data.receiver;
        form.forEach(item => {
            switch (item.key) {
                case 'name':
                    item.value = receiver_name;
                    break;
                case 'phone':
                    item.value = receiver_phone;
                    break;
                case 'address':
                    item.value = `${receiver_state}/${receiver_city}/${receiver_district}`;
                    this.setData({ areacode: receiver_areacode });
                    break;
                case 'addressInfo':
                    item.value = receiver_address;
                    break;
                case 'code':
                    item.value = receiver_zipcode;
                    break;
                default:
                    item.value = '';
            }
        });
        this.setData({
            isLoading: false,
            form,
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

    // 保存表单
    onSaveForm() {
        let { form } = this.data;
        try {
            this.checkForm();
        } catch (error) {
            wx.showModal({
                title: '温馨提示',
                content: error.message || error.errMsg || '提交失败',
                showCancel: false,
            });
        }
    },

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
        let success = form.every(item => item.value);
        if (!success) {
            throw new Error('请填写完整表单');
        }
    },

    // 弹出级联选择器
    onShowArea(e) {
        let { code } = e.currentTarget.dataset;
        this.setData({
            showAreaPanel: true,
            areacode: code,
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
        // 地区拼接
        let areaStr = values.reduce((accumulator, currentValue) => accumulator + currentValue);
        this.setData({
            areacode,
        });
        console.log('areacode', areacode);
        this.onCloseArea();
    },
});
