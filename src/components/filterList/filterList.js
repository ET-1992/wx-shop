Component({
    properties: {
        filterListData: {
            type: Array,
            value: []
        },
        filterData: {
            type: Object,
            value: {},
            observer(newValue) {
                if (newValue) {
                    this.setData({
                        isActive: {
                            [newValue.filterIndex]: newValue.filterType
                        }
                    });
                }
            }
        }
    },
    data: {
        isActive: {
            0: 'Up'
        }
    },
    methods: {
        changeActive(e) {
            console.log('e15', e);
            const { index } = e.currentTarget.dataset;
            let type = 'Up';
            if (this.data.isActive[index] === 'Up') {
                type = 'Down';
            }
            const filter = {
                filterIndex: index,
                filterType: type
            };
            this.triggerEvent('changeFilterList', filter, { bubbles: true });
        }
    }
});

