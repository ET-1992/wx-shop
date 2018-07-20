import api from 'utils/api';

Page({
    data: {
        title: 'shareCenter',
        isShowModal: false,
        loading: true,
        member: {},
        wallet: {}
    },

    onLoad(parmas) {
        console.log(parmas);
        wx.showLoading();
    },
    async onShow() {
        const data = await api.hei.shareUserInfo();
        const { member, wallet } = data;
        console.log(data, 'data');
        this.setData({
            member,
            wallet
        });
        wx.hideLoading();
    },
    changeModal() {
        this.setData({
            isShowModal: !this.data.isShowModal
        });
    },
    goToShare(e) {
        console.log(e, '090');
        const { urldata } = e.currentTarget.dataset;
        let url = '';
        switch (urldata) {
            case 'shareMoney': {
                const { wallet, member } = this.data;
                url = `/pages/share/shareMoney/shareMoney?balance=${wallet.balance}&income_pending=${wallet.income_pending}&code=${member.code}`;
                break;
            }
            case 'shareFinishUserInfo': {
                url = '/pages/share/shareFinishUserInfo/shareFinishUserInfo';
                break;
            }
            case 'shareProductList': {
                url = '/pages/share/shareProductList/shareProductList';
                break;
            }
            case 'shareDetail': {
                url = '/pages/share/shareDetail/shareDetail';
                break;
            }
            case 'sharePoster': {
                url = '/pages/share/sharePoster/sharePoster';
                break;
            }
            default:
                break;
        }
        wx.navigateTo({
            url
        });
    }
});
