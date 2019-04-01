import { getAgainUserForInvalid } from 'utils/util';
const app = getApp();
Component({
    properties: {
        personalComponentData: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ...newValue
                });
            }
        },
        config: {
            type: Object,
            value: {}
        }
    },
    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({
                user
            });
        },
        consoleOpen() {
            this.triggerEvent('consoleOpen', {}, { bubbles: true });
        }
    }
});