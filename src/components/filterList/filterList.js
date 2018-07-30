Component({
    properties: {
        filterListData: {
            type: Array,
            value: []
        }
    },
    data: {
        isActive: {
            0: 'Down'
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
            }, () => {
                const filter = {
                    filterIndex: index,
                    filterType: type
                };
                this.triggerEvent('changeFilterList', filter, { bubbles: true });
            });
        }
    }
});

