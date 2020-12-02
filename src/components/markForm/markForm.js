import api from 'utils/api';

Component({
    properties: {
        form: {
            type: Array,
            value: [],
        },
    },
    data: {
        collection: {},
        fileList: [],
    },
    methods: {
        // 表单输入
        onFormChange(e) {
            let { detail, currentTarget: { dataset: { name }, }} = e,
                { collection, form } = this.data,
                index = form.findIndex(item => item.name === name);

            if (form[index].type === 'select') {
                // 下拉选择
                detail = form[index].options[detail.value];
            } else if (detail.value) {
                // 日期/时间
                detail = detail.value;
            }
            form[index].value = detail;
            collection[name] = detail;
            this.setData({ collection, form });
            console.log('collection', collection);
        },

        // 文件读取完成
        async afterRead(e) {
            // console.log('e', e);
            let { file } = e.detail,
                { name } = e.currentTarget.dataset,
                { fileList, collection } = this.data;

            try {
                const data = await api.hei.upload({
                    filePath: file.path
                });
                let { url } = JSON.parse(data);
                console.log('url', url);
                collection[name] = url;
                fileList.push({ ...file, url });

                this.setData({ fileList, collection });
                console.log('collection', collection);

            } catch (e) {
                wx.showModal({
                    title: '温馨提示',
                    content: e.errmsg || e.errMsg,
                    showCancel: false
                });
            }
        },

        // 文件删除
        onFileDelete(e) {
            let { index } = e.detail,
                { fileList } = this.data;
            fileList.splice(index, 1);
            this.setData({ fileList });
        },
    },
});
