Component({
    properties: {
        isMarginTopZero: {
            type: Boolean,
            value: false,
        },
        magicImgData: {
            type: Object,
            value: {},
            observer(newValue) {
                if (newValue.layout === '2-2') {
                    newValue.flex = [2, 1];
                }
                if (newValue.layout === '2-3') {
                    newValue.flex = [1, 2];
                }
                if (newValue.layout.charAt(newValue.layout.length - 1) === '1' || newValue.layout === '2-2' || newValue.layout === '2-3') {
                    newValue.defineType = 'oneLine';
                    newValue.eachNum = Number(newValue.layout.charAt(0));
                }
                this.setData({
                    magicImgData: newValue
                });
            }
        }
    }
});

