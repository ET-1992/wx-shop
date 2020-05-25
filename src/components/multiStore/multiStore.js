Component({
    properties: {
        storeName: {
            type: String,
            value: '获取门店失败',
        },
    },
    methods: {
        // 切换门店
        onChangeStore(e) {
            console.log('e', e);
            wx.navigateTo({
                url: '/pages/multiStoreList/multiStoreList'
            });
        },

    }
});

