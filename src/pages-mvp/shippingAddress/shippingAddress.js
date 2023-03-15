import { auth, wxReceriverPairs } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY, CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        config: {},
        addressList: [
  {
    'id': 98447,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1630927543,
    'receiver_address': '广东省广州市海珠区新港中路397号',
    'receiver_city': '广州市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '海珠区',
    'receiver_name': '张三',
    'receiver_phone': '020-81167888',
    'receiver_state': '广东省',
    'receiver_weixin': '',
    'receiver_zipcode': '510000',
    'receiver_areacode': 510000,
    'longtitude': '113.32377',
    'latitude': '23.09642',
    'room': '',
    'time': 1630927543
  },
  {
    'id': 1064,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1591088218,
    'receiver_address': '丛云路388号云山居幼儿园斜坡旁武警家属楼',
    'receiver_city': '广州市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '白云区',
    'receiver_name': '彭飞谍',
    'receiver_phone': '17620191399',
    'receiver_state': '广东省',
    'receiver_weixin': '',
    'receiver_zipcode': '510080',
    'receiver_areacode': 440111,
    'longtitude': '113.296934',
    'latitude': '23.209797',
    'room': '',
    'time': 1591088218
  },
  {
    'id': 1053,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1590900202,
    'receiver_address': '北京市西城区大栅栏',
    'receiver_city': '北京市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '西城区',
    'receiver_name': '彭飞谍',
    'receiver_phone': '17620191399',
    'receiver_state': '北京市',
    'receiver_weixin': '',
    'receiver_zipcode': '020000',
    'receiver_areacode': 110102,
    'longtitude': '',
    'latitude': '39.895603',
    'room': '',
    'time': 1590900202
  },
  {
    'id': 838,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1590721633,
    'receiver_address': '丛云路388号云山居幼儿园斜坡旁武警家属楼',
    'receiver_city': '广州市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '白云区',
    'receiver_name': '彭飞谍',
    'receiver_phone': '17620191399',
    'receiver_state': '广东省',
    'receiver_weixin': '',
    'receiver_zipcode': '510080',
    'receiver_areacode': 440111,
    'longtitude': '113.296934',
    'latitude': '23.209797',
    'room': '',
    'time': 1590721633
  },
  {
    'id': 837,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1590721105,
    'receiver_address': '新港中路397号',
    'receiver_city': '广州市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '海珠区',
    'receiver_name': '张三',
    'receiver_phone': '020-81167888',
    'receiver_state': '广东省',
    'receiver_weixin': '',
    'receiver_zipcode': '510000',
    'receiver_areacode': 510000,
    'longtitude': '113.32377',
    'latitude': '23.09642',
    'room': '',
    'time': 1590721105
  },
  {
    'id': 836,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1590720873,
    'receiver_address': '丛云路388号云山居幼儿园斜坡旁武警家属楼',
    'receiver_city': '广州市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '白云区',
    'receiver_name': '彭飞谍',
    'receiver_phone': '17620191399',
    'receiver_state': '广东省',
    'receiver_weixin': '',
    'receiver_zipcode': '510080',
    'receiver_areacode': 440111,
    'longtitude': '113.296934',
    'latitude': '23.209797',
    'room': '',
    'time': 1590720873
  },
  {
    'id': 835,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1590720786,
    'receiver_address': '用',
    'receiver_city': '齐齐哈尔市',
    'receiver_default': 0,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '龙沙区',
    'receiver_name': '谍',
    'receiver_phone': '17620191399',
    'receiver_state': '黑龙江省',
    'receiver_weixin': '',
    'receiver_zipcode': '161000',
    'receiver_areacode': 230202,
    'longtitude': '123.95763',
    'latitude': '47.31742',
    'room': '',
    'time': 1590720786
  },
  {
    'id': 834,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
    'modified': 1590720756,
    'receiver_address': '用',
    'receiver_city': '齐齐哈尔市',
    'receiver_default': 1,
    'receiver_profile': null,
    'receiver_country': '',
    'receiver_district': '龙沙区',
    'receiver_name': '谍',
    'receiver_phone': '17620191399',
    'receiver_state': '黑龙江省',
    'receiver_weixin': '',
    'receiver_zipcode': '161000',
    'receiver_areacode': 230202,
    'longtitude': '123.95763',
    'latitude': '47.31742',
    'room': '',
    'time': 1590720756
  }
],  // 地址列表
        isLoading: true,
        radioSelected: '',  // 地址选中项
        seletedId: '',  // 进入时地址选中项ID
    },

    onLoad(params) {
        console.log(params);
        let { id: seletedId = '' } = params;
        this.getBasicData();
        this.setData({
            seletedId,
        });
    },

    onShow() {
        this.getAddressList();
    },

    // onUnload() {
    //     let { radioSelected } = this.data;
    //     if (radioSelected === '') { return }
    //     this.keepSelectedAddress();
    // },

    getBasicData() {
        const config = wx.getStorageSync(CONFIG);
        this.setData({
            config,
        });
    },

    // 默认地址选中项
    findRadioSeleted() {
        let { radioSelected, addressList = [], seletedId } = this.data;
        if (radioSelected) {
            return;
        }
        let address = wx.getStorageSync(ADDRESS_KEY);
        // 先获取页面传递地址，后读取缓存地址
        let id = Number(seletedId) || address.id;
        let index = addressList.findIndex(value => {
            return value.id === id;
        });
        if (index > -1) {
            this.setData({
                radioSelected: index,
            });
        }
    },

    // 地址单选框选中时
    radioChange(event) {
        let index = event.detail;
        this.setData({
            radioSelected: index,
        });
        this.keepSelectedAddress();
        wx.navigateBack();
    },

    // 保存选中地址
    keepSelectedAddress() {
        let { addressList, radioSelected } = this.data;
        let address = addressList[radioSelected];
        // 选中地址对象
        let selectedAddress = wxReceriverPairs(address);
        // 添加经纬度
        let { latitude, longtitude: longitude, room } = address;
        selectedAddress = Object.assign(selectedAddress, { latitude, longitude, room });
        // wx.setStorageSync(ADDRESS_KEY, selectedAddress);
        app.event.emit('setAddressListEvent', selectedAddress);
    },

    // 获取地址列表
    async getAddressList() {
        // let data = await api.hei.getReceiverList();
        // let { receivers } = data;

        // this.setData({
        //     addressList: receivers,
        //     isLoading: false,
        // });
        this.findRadioSeleted();
    },

    // 编辑或添加地址
    onAddressEdit(e) {
        let { type, id } = e.currentTarget.dataset;
        let url = `../addressEdit/addressEdit?type=${type}`;
        if (id) {
            // 编辑地址需携带ID
            url += `&id=${id}`;
        }
        wx.navigateTo({
            url,
        });
    },

    // 微信导入地址
    async onImportAddress() {
        wx.showLoading({
            title: '加载中',
        });
        const res = await auth({
            scope: 'scope.address',
            ctx: this
        });
        if (!res) { return }
        try {
            await this.postAddress();
            wx.showToast({
                title: '添加地址成功',
                duration: 1000,
            });
            this.getAddressList();
        } catch (error) {
            console.log('error', error);
            // 忽略主动取消报错
            if (error && error.code) {
                wx.showModal({
                    title: '温馨提示',
                    content: error.errMsg || '提交失败',
                    showCancel: false,
                });
            }
        } finally {
            wx.hideLoading();
        }
    },

    // 发送微信地址
    async postAddress() {
        const address = await chooseAddress();
        // 将省市区拼接到详细地址
        let { provinceName, cityName, countyName, detailInfo } = address;
        let newDetailInfo = [provinceName, cityName, countyName, detailInfo].join('');
        Object.assign(address, { detailInfo: newDetailInfo });

        let locationObj = await this.parseAddress(address) || {};
        let tranData = wxReceriverPairs(address);
        tranData = Object.assign(tranData, locationObj);
        await api.hei.addReceiverInfo(tranData);
    },

    // 微信地址解析
    async parseAddress(res) {
        let { config } = this.data;
        let { cityName, detailInfo } = res;
        let data = {
            key: config.mapKey || 'XHSBZ-OOU6P-DHDDK-LEC5P-3CBJ6-VXF5H',
            address: detailInfo,
            region: cityName,
        };
        let url = 'https://apis.map.qq.com/ws/geocoder/v1';
        try {
            let res = await proxy.request({
                url,
                data,
            });
            console.log('收货地址解析结果：', res);
            let lat = '',
                lng = '';
            if (res.data && res.data.status === 0) {
                ({ lat, lng } = res.data.result.location);
            }
            return {
                // 后端适配字段
                latitude: lat,
                longtitude: lng,
            };
        } catch (error) {
            console.log('地址解析错误', error);
        }
    },
});