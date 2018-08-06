import api from 'utils/api';

Page({
    data: {
        title: 'affiliateCenter',
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
    goToAffiliate(e) {
        console.log(e, '090');
        const { urldata } = e.currentTarget.dataset;
        let url = '';
        switch (urldata) {
            case 'affiliateMoney': {
                const { wallet, member } = this.data;
                url = `/pages/affiliate/affiliateMoney/affiliateMoney?balance=${wallet.affiliate_balance}&income_pending=${wallet.affiliate_income_pending}&code=${member.code}`;
                break;
            }
            case 'affiliateFinishUserInfo': {
                url = '/pages/affiliate/affiliateFinishUserInfo/affiliateFinishUserInfo';
                break;
            }
            case 'affiliateProductList': {
                url = '/pages/affiliate/affiliateProductList/affiliateProductList';
                break;
            }
            case 'affiliateDetail': {
                url = '/pages/affiliate/affiliateDetail/affiliateDetail';
                break;
            }
            case 'affiliatePoster': {
                const { postertype } = e.currentTarget.dataset;
                console.log(postertype, 'poser');
                url = '/pages/affiliate/affiliatePoster/affiliatePoster?postertype=' + postertype;
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
