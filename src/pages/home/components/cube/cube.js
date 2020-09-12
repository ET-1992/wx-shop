Component({
    properties: {
        cube: {
            type: Object,
            value: {},
            observer(newVal) {
                if (newVal) {
                    const { setting, content } = newVal;
                    const magicImgData = {
                        images: content,
                        height: setting.height,
                        layout: setting.layout,
                        mode: setting.mode,
                        spacing: setting.spacing,

                    };
                    this.setData({
                        magicImgData,
                        setting
                    });
                }
            }
        }
    }
});