import { chooseImage, showToast } from 'utils/wxp';
import api from 'utils/api';
import { checkPhone, checkEmail, checkIdNameNum } from 'utils/util';

Component({
    properties: {
        annotation: {
            type: Array,
            value: [],
        },

        isShowModal: {
            type: Boolean,
            value: false,
        }
    },
    data: {
        dns_obj: {}
    },
    ready() {
        const { annotation, dns_obj } = this.data;
        annotation.forEach((item, index) => {
            if (item.value) {
                dns_obj[item.name] = item.value;
            }
        });
        this.setData({
            dns_obj
        });
    },
    methods: {
        async onUpload(e) {
            console.log(e);
            const { annotationname, index } = e.currentTarget.dataset;
            const { annotation, dns_obj } = this.data;
            const { tempFilePaths } = await chooseImage({
                count: 1
            });
            try {
                const data = await api.hei.upload({
                    filePath: tempFilePaths[0]
                });
                const { url } = JSON.parse(data);
                console.log(url);
                if (url) {
                    // dns_obj.push({ [annotationname]: url });
                    dns_obj[annotationname] = url;
                    annotation[index].isError = false;
                    annotation[index].value = url;
                    this.setData({
                        dns_obj,
                        annotation
                    }, () => {
                        console.log(this.data);
                    });
                }
            }
            catch (err) {
                console.log(err);
            }
        },

        saveData(e) {
            console.log(e);
            const { annotationname, index, type } = e.currentTarget.dataset;
            const { value } = e.detail;
            const { annotation, dns_obj } = this.data;

            dns_obj[annotationname] = value;
            annotation[index].value = value;
            this.setData({
                dns_obj,
                annotation
            }, () => {
                console.log(this.data);
            });
        },

        checkError(e) {
            const { annotationname, index, type } = e.currentTarget.dataset;
            const { value } = e.detail;
            const { annotation, dns_obj } = this.data;

            if (value) {
                // dns_obj.push({ [annotationname]: value });
                console.log(value);

                if (type === 'phone_number') {
                    annotation[index].isError = annotation[index].required && !checkPhone(value);
                    if (annotation[index].isError) {
                        showToast({
                            title: '请输入正确的手机格式',
                            icon: 'none'
                        });
                    }
                } else if (type === 'email') {
                    annotation[index].isError = annotation[index].required && !checkEmail(value);
                    if (annotation[index].isError) {
                        showToast({
                            title: '请输入正确的邮箱格式',
                            icon: 'none'
                        });
                    }
                } else if (type === 'id_number') {
                    annotation[index].isError = annotation[index].required && !checkIdNameNum(value);
                    if (annotation[index].isError) {
                        showToast({
                            title: '请输入18位数的身份证号码',
                            icon: 'none'
                        });
                    }
                } else {
                    annotation[index].isError = false;
                }


                dns_obj[annotationname] = value;
                annotation[index].value = value;
                this.setData({
                    dns_obj,
                    annotation
                }, () => {
                    console.log(this.data);
                });
            } else {
                if (annotation[index].required) {
                    annotation[index].isError = true;
                }
                this.setData({
                    annotation
                }, () => {
                    console.log(this.data);
                });
            }
        },

        resetError(e) {
            const { annotationname, index } = e.currentTarget.dataset;
            const { value } = e.detail;
            const { annotation, dns_obj } = this.data;
            annotation[index].isError = false;
            this.setData({
                annotation
            }, () => {
                console.log(this.data);
            });
        }
    }
});

