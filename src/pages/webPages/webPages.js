const app = getApp();
Page({
    data: {

    },

    async onLoad(parmas) {
        let { src, scene } = parmas;
        if (scene) {
            scene = decodeURIComponent(scene);
            let query = {};
            if (scene.indexOf('&') > -1) {
                const array = scene.split('&');
                array.forEach((item) => {
                    const itemArray = item.split('=');
                    query[itemArray[0]] = itemArray[1];
                });
            } else {
                const sceneArray = scene.split('=');
                query[sceneArray[0]] = sceneArray[1];
            }
            console.log(query, 'query');
            if (query.afcode) {
                app.globalData.afcode = query.afcode;
                app.bindShare({ code: query.afcode });
            }
            if (query.id) {
                wx.redirectTo({
                    url: '/pages/productDetail/productDetail?id=' + query.id
                });
            }
        } else {
            this.setData({ src });
        }
    },
});
