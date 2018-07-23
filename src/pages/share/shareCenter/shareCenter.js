import api from 'utils/api';

Page({
    data: {
        title: 'shareCenter',
        isShowModal: false,
        isLoading: true,
        member: {},
        wallet: {}
    },

    onLoad(parmas) {
        console.log(parmas);
    },
    async onShow() {
        const data = await api.hei.shareUserInfo();
        const { member, wallet, affiliate_enable } = data;
        console.log(data, 'data');
        this.setData({
            member,
            wallet,
            isLoading: false,
            affiliate_enable
        });
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
                const { postertype } = e.currentTarget.dataset;
                console.log(postertype, 'poser');
                url = '/pages/share/sharePoster/sharePoster?postertype=' + postertype;
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
