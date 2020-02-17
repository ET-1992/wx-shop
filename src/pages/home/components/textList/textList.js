Component({
	properties: {
		title: {
			type: String,
			value: 'textList Component',
		},
		switchData: {
			type: Boolean,
			value: false,
    },
    module: {
      type: Object,
      value: {
        title: '文本列表',
        setting: {
          title_display: true,
          title_position: 'left',
          margin: 20,
          display_direction: 'column',
        },
        content: [
          {
            type: '',
            path: '#',
            page_key: 'groupon',
            text: '列表文字1',
          },
          {
            type: '',
            path: '#',
            page_key: 'groupon',
            text: '列表文字2',
          },
        ]
      }
    }
  },
});

