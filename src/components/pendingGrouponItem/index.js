
import getRemainTime from 'utils/getRemainTime';

Component({
	properties: {
		groupon: {
			type: Object,
			value: {},
			observer(newVal) {
				if (!newVal) { return; }
				const { time_expired, time } = newVal;
				const now = Math.round(Date.now() / 1000);
				let timeLimit = time_expired - now;
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

				if (timeLimit) {
					this.intervalId = setInterval(() => {
						const { timeLimit } = this.data;
						const [hour, minute, second] = getRemainTime(timeLimit);
						this.setData({
							'timeLimit': timeLimit - 1,
							remainTime: {
								hour,
								minute,
								second,
							}
						});
					}, 1000);
				}
			},
		}
	},

	data: {
		remainTime: {
			hour: '00',
			minute: '00',
			second: '00',
		},
	},

	detached() {
		clearInterval(this.intervalId);
	},

	methods: {
		onGroupon() {
			const { id } = this.data.groupon;
			console.log(id);
			this.triggerEvent('groupEvent', { grouponId: id });
		},
	}
});
