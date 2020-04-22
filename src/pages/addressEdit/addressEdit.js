
Page({
    data: {
        title: 'addressEdit',
        type: 'update',  // 地址更新或添加
        form: [
            { key: 'name', value: '', label: '姓名' },
            { key: 'phone', value: '', label: '手机号码' },
            { key: 'address', value: '', label: '地址' },
            { key: 'addressInfo', value: '', label: '详细地址' },
            { key: 'code', value: '', label: '邮政编码' },
        ]
    },

    onLoad(params) {
        console.log(params);
        let { type } = params;
        this.setData({
            type,
        });
        this.setPage();
    },

    // 设置页面
    setPage() {
        let { type = 'update' } = this.data;
        const typeToTitle = {
            'update': '地址编辑',
            'add': '地址添加',
        };
        wx.setNavigationBarTitle({
            title: typeToTitle[type],
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

    // 校验表单
    checkForm() {
        let { form } = this.data;
        let success = form.every(item => item.value);
        if (!success) {
            throw new Error('请填写完整表单');
        }

    },
});
