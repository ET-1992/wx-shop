Component({
    properties: {
        filterListData: {
            type: Array,
            value: []
        }
    },
    data: {
        isActive: {
            1: 'Up'
        }
    },
    methods: {
        changeActive(e) {
            console.log(e);
            const { index } = e.currentTarget.dataset;
            let type = 'Up';
            if (this.data.isActive[index] === 'Up') {
                type = 'Down';
            }
            this.setData({
                isActive: {
                    [index]: type
                }
            });
        }
    }
});

