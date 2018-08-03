import api from 'utils/api';
import { auth, getDistance } from 'utils/util';
import { getLocation } from 'utils/wxp';

const app = getApp();

Page({
    data: {
        title: 'liftList',
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
            console.log(res);
            const { latitude, longitude } = data;
        }

        try {
            const { address_list, self_lifting_enable } = await api.hei.liftList();
        } catch (e) {
            console.log(e);
        }
    }
});
