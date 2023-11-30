
import api from 'utils/api';
import { autoTransformAddress, formatTime, valueToText } from 'utils/util';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';
import { POINTS_TYPE } from 'constants/index';

const app = getApp();

Page({
    data:{
        navbarListData:POINTS_TYPE,
        activeIndex:1,
        themeColor:''
    },

    changeNavbarList(){

    }
})