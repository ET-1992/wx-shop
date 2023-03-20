import { auth, wxReceriverPairs } from 'utils/util';
import { chooseAddress } from 'utils/wxp';
import { ADDRESS_KEY, CONFIG } from 'constants/index';
import proxy from 'utils/wxProxy';
import api from 'utils/api';

const app = getApp();

Page({
    data: {
        config: {},
        couponList: [
  {
    'id': 98447,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
  },
  {
    'id': 1064,
    'platform_user_id': 1531454,
    'appid': 'wx205da4d5cad1c388',
    'openid': 'oSLQA0TljgATZeKQzGsUOYhv07aA',
  }
]
    },


});