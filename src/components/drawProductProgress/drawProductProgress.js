Component({
    properties: {
        title: {
            type: String,
            value: 'drawProductProgress Component',
        },
        activity: Object,
    },
    data: {
        currentNum: '', // 已购
        totalNum: '', // 总需认输
        restNum: '', // 剩余
        numPercentage: 0,
        status: 1,
    },
    observers: {
        'activity': function (e) {
            let {
                quantity: totalNum,
                current_quantity: currentNum,
                progress: numPercentage,
                status
            } = e;
            let restNum = totalNum - currentNum;
            this.setData({
                totalNum,
                currentNum,
                restNum,
                numPercentage,
                status
            });
        }
    }
});