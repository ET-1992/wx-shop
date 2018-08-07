import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import { getLocation } from 'utils/wxp';

const app = getApp();

Page({
    data: {
        isLoading: true,
    },

    onLoad(parmas) {
        console.log(parmas);
    },

    async onShow() {
        const res = await auth({
            scope: 'scope.userLocation',
            ctx: this
        });
        if (res) {
            const data = await getLocation();
            console.log(data, 'data');
            const { latitude, longitude } = data;
            try {
                const { address_list, self_lifting_enable } = await api.hei.liftList();
                address_list.forEach((item, index) => {
                    let distance = getDistance(latitude, longitude, Number(item.latitude), Number(item.longtitude));
                    item.distance = Number(distance).toFixed(2);
                    item.checked = false;
                });

                address_list.sort((a, b) => {
                    return Number(a.distance) - Number(b.distance);
                });

                this.setData({
                    address_list,
                    isLoading: false
                });
                console.log(address_list);
            } catch (e) {
                console.log(e);
            }
        }
    },

    getLiftInfo(e) {
        const { address_list } = this.data;
        const { value } = e.detail;
        this.setTrueLiftItem(Number(value));
        const item = address_list[Number(value)] || {};
        const liftInfo = {
            receiver_address_phone: item.phone,
            receiver_state: item.state,
            receiver_city: item.city,
            receiver_district: item.district,
            receiver_address: item.address,
            receiver_address_name: item.name
        };
        app.event.emit('getLiftInfoEvent', liftInfo);
    },

    setTrueLiftItem(index) {
        const { address_list } = this.data;
        address_list.forEach((item) => {
            item.checked = false;
        });
        address_list[index].checked = true;
        this.setData({
            address_list
        });
    }
});
