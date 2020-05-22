Component({
    properties: {
        title: {
            type: String,
            value: 'multiStore Component',
        }
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

