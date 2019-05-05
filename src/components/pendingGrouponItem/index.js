Component({
    properties: {
        groupon: {
            type: Object,
            value: {},
            observer(newVal) {
                if (!newVal) { return }
                const { time_expired, time } = newVal;
                const now = Math.round(Date.now() / 1000);
                let timeLimit = time_expired - now;

                if (!timeLimit) {
                    this.triggerEvent('getExpiredGroupon', { id: newVal.id, timeLimit });
                }

                let hasStart = true;
                let hasEnd = false;
                if (now < time) {
                    hasStart = false;
                    timeLimit = now - time;
                }

                if (now > time_expired) {
                    hasEnd = true;
                    timeLimit = 0;
                }
                this.setData({
                    timeLimit,
                    hasStart,
                    hasEnd
                });

            },
        }
    },

    methods: {
        onGroupon() {
            const { id } = this.data.groupon;
            console.log(id);
            this.triggerEvent('groupEvent', { grouponId: id });
        },
    }
});
