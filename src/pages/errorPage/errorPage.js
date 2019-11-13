
import { autoNavigate } from 'utils/util';

Page({
    data: {
        title: '500',
    },

    onLoad(params) {
        console.log(params);
    },

    navigateToHome() {
        autoNavigate('/pages/home/home');
    },
});
