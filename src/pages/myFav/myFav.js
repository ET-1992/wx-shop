import proxy from 'utils/wxProxy';
import api from 'utils/api';
Page({
    data: {
        topics: [],
        next_cursor: 0,
        isLoading: true,
        share_title: '',
        page_title: '',
        navbarListData: [
            { text: '文章收藏', value: 'article' },
            { text: '商品收藏', value: 'product' }
        ],
        activeIndex: 0
    },
    onLoad() {
        this.getFavList();
        wx.setNavigationBarTitle({
            title: '我的收藏'
        });
    },

    async getFavList() {
        const { next_cursor, activeIndex } = this.data;
        let method =  activeIndex ? 'getFavProductList' : 'queryFavList';
        const favData = await api.hei[method]({
            cursor: next_cursor,
        });
        let newData = this.data.topics.concat(activeIndex ? favData.products : favData.articles);
        this.setData({
            topics: newData,
            isLoading: false,
            next_cursor: favData.next_cursor,
        });
        console.log(this.data.topics);
    },

    async unfav(e) {
        console.log(e);
        const { activeIndex } = this.data;
        const { id: post_id } = e.currentTarget.dataset;
        const { confirm } = await proxy.showModal({
            title: '温馨提示',
            content: '确定取消收藏吗？'
        });
        if (confirm) {
            let method = activeIndex ? 'unFavProduct' : 'unfav';
            await api.hei[method]({ post_id });
            this.setData({
                topics: [],
                isLoading: true
            });
            this.getFavList();
        }
    },
    changeNavbarList(e) {
        console.log(e);
        const { index } = e.detail;
        this.setData({
            activeIndex: index,
            topics: [],
            isLoading: true
        });
        this.getFavList();
    },
    onTouchStart(e) {
        this.data.clineX = e.touches[0].clientX;
    },
    onTouchEnd(e) {
        let { activeIndex } = this.data;
        if (e.changedTouches[0].clientX - this.data.clineX < -120) {
            this.moveIndex(activeIndex + 1);
        }
        if (e.changedTouches[0].clientX - this.data.clineX > 120) {
            this.moveIndex(activeIndex - 1);
        }
    },
    moveIndex(index) {
        let activeIndex = index;
        const { navbarListData } = this.data;
        const { length, last = length - 1 } = navbarListData;
        if (activeIndex < 0) {
            return;
        }
        if (index > last) {
            activeIndex = 0;
        }
        this.setData({
            topics: [],
            activeIndex,
            isLoading: true,
            next_cursor: 0,
        });
        this.getFavList();
    },
    onPullDownRefresh: function() {
        this.setData({
            next_cursor: 0,
            topics: [],
            isLoading: true
        });
        this.getFavList();
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        const { next_cursor } = this.data;
        if (!next_cursor) { return }
        this.getFavList();
    }
});