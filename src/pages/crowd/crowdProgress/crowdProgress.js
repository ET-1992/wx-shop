Page({
    data: {
        'records': [
            {
                'avatarurl': 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLCzHlibGticmt7kKWJOWoB8uV46Za0wg92NcDnqS6GicfoQvlOyNNExNB9uBicwcIJ7LviaHBibkdW2OTrQ/132',
                'nickname': 'Well',
                'amount': '900.00',
                'word': '谢谢'
            },
            {
                'avatarurl': 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLCzHlibGticmt7kKWJOWoB8uV46Za0wg92NcDnqS6GicfoQvlOyNNExNB9uBicwcIJ7LviaHBibkdW2OTrQ/132',
                'nickname': 'Well',
                'amount': '900.00',
                'word': '谢谢'
            },
            {
                'avatarurl': 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLCzHlibGticmt7kKWJOWoB8uV46Za0wg92NcDnqS6GicfoQvlOyNNExNB9uBicwcIJ7LviaHBibkdW2OTrQ/132',
                'nickname': 'Well',
                'amount': '900.00',
                'word': '谢谢'
            },
        ],
        'order': {
            'image_url': 'http://cdn2.wpweixin.com/wp-content/uploads/sites/339/2018/01/1514965358-1.png',
            'products': '测试商品 | 女式可拆卸狐狸毛牛仔外套  数量:1',
            'amount': '999.10',
            'time': '1542869822', // 发起时间
            'status': '0',
            'pay_amount': '1880.00', // 已支付金额
            'crowd_pay_no': 'EgBumTwo'// 众筹订单号
        },
        targetTime: new Date().getTime() + 1542869822,
    },

    onLoad(parmas) {
        console.log(parmas);
        wx.setNavigationBarTitle({
            title: '代付进度'
        });
    },
});
