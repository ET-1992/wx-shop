Component({
    properties: {
        items: {
            type: Object,
            value: {},
            observer(newValue) {
                if (!newValue) {
                    return;
                }
                const nowTime = Date.now() / 1000;
                let products = [];
                if (this.data.itemStyle === 1) {
                    products = newValue.map((item) => {
                        return {
                            ...item,
                            imageUrl: item.image_url,
                            property: item.sku_property_names,
                            price: (item.miaosha_end_timestamp >= nowTime && nowTime >= item.miaosha_start_timestamp) ? item.miaosha_price : item.price
                        };
                    });
                } else if (this.data.itemStyle === 2) {
                    products.push({
                        ...newValue,
                        memberlimit: newValue.member_limit,
                        imageUrl: newValue.thumbnail,
                        quantity: newValue.member_count
                    });
                }
                console.log(products, 'products');
                this.setData({
                    products
                });
            }
        },
        itemStyle: {
            type: Number,
            value: 1 // 1:非团购 2：团购类型
        }
    },
    data: {
        products: []
    }
});
