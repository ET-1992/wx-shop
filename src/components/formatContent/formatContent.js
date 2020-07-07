Component({
    properties: {
        type: {
            type: String,
            value: '',
        },
        content: {
            type: Object,
            value: {}
        },
        author: {
            type: Object,
            value: {}
        }
    },
    methods: {
        previewImage(ev) {
            const originalImages = [];
            const { content, type } = this.data;
            const { index } = ev.currentTarget.dataset;
            if (type === 'gallery') {
                content.gallery.forEach(item => {
                    originalImages.push(item.image);
                });
            }
            if (type === 'image') {
                content.images.forEach(item => {
                    originalImages.push(item.image);
                });
            }
            wx.previewImage({
                urls: originalImages,
                current: originalImages[index]
            });
        }
    },
});

