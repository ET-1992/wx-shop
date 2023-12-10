
import api from 'utils/api';
import { ORDER_STATUS_TEXT } from 'constants/index';
import wxProxy from 'utils/wxProxy';
import { autoTransformAddress, joinUrl } from 'utils/util';

const app = getApp();

Page({
    data: {
        medal_group: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.getMedalList()
        // app.event.on('setMedalData', medal);
    },
    async getMedalList() {
        try {
            let response = await api.hei.pvmMedalList({})
            console.log('responsexxx', response)
            if (response.errcode == 0) {
                let { medal_group } = response
                this.setData({
                    medal_group
                })
            } else {

            }
        } catch (error) {

        }

    },

    jumpDetail(e) {
        let { medal } = e.currentTarget.dataset
        // let params = { ...medal }
        // console.log(' app.event', app.event)
        wx.setStorageSync('medal',medal)
        wx.navigateTo({
            url: joinUrl('/pages-pvm/medalDetail/medalDetail', {}),
        })
    }
})