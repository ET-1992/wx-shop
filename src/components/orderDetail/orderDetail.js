// const app = getApp();

Component({
  properties: {
    open: false,
  },

  methods: {
    onClick() {
      this.setData({ open: !this.data.open });
    },
  },
});
