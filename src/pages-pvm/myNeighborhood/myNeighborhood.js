import api from 'utils/api';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';
import { autoTransformAddress, joinUrl } from 'utils/util';

const app = getApp();

Page({
  data: {
    list: [
      // {
      //   id: 2,
      //   account_id: 8,
      //   level: 1,
      //   path: '/1/',
      //   code: 'bEXMnOGC',
      //   bind_time: 1704351197, // 成为时间
      //   audit_status: 2,
      //   order_count: 0,
      //   sub_order_count: 0,
      //   grandchild_order_count: 0,
      //   commission: 0, // 产生的收益（累计积分）
      //   sub_commission: 0,
      //   grandchild_commission: 0,
      //   user_type: 1,
      //   sub_member_count: 0,
      //   grandchild_member_count: 0,
      //   customer_count: 0,
      //   expire_day: 1706943727,
      //   status: 0,
      //   account: {
      //     id: 8,
      //     account_id: 8,
      //     nickname: '',
      //     avatarurl: 'http://test.wpweixin.com/wp-content/uploads/sites/6749/2023/12/1703852968-snymQiTOhY2O5b6b02f39c7995e32d3f949c0971e965.jpeg?width=132&height=132&orientation=landscape', // 头像
      //     display_name: '191****3148', // 显示昵称
      //     country: 'CN',
      //     province: '',
      //     city: '',
      //     gender: 0,
      //     anonymous: false,
      //   },
      // },
    ],
    people: 0,
    points: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getMemberList();
    this.getChildMemberList();
  },

  async getMemberList() {
    try {
      let { errcode, errmsg, member } = await api.hei.memberList();
      console.log('errcode', errcode);
      if (errcode === 0) {
        let people = member.sub_member_count;
        let points = member.sub_commission;
        this.setData({
          people,
          points,
        });
      }
    } catch (e) {
      console.log('e', e);
      wx.showModal({
        title: '温馨提示',
        content: e.errMsg,
        showCancel: false,
      });
    }
  },
  async getChildMemberList() {
    try {
      let { errcode, errmsg, members } = await api.hei.childMemberList();
      console.log('errcode', errcode);
      if (errcode === 0) {
        let list = members;
        this.setData({
          list
        });
      }
    } catch (e) {
      console.log('e', e);
      wx.showModal({
        title: '温馨提示',
        content: e.errMsg,
        showCancel: false,
      });
    }
  },
});
