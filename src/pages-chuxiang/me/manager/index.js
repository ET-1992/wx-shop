import { getAgainUserForInvalid } from 'utils/util';
Component({
    properties: {
        openManager: {
            type: Boolean,
            value: false
        },
        manager: {
            type: Object,
            value: {}
        },
        no_dedicated_manager_text: {
            type: String,
            value: ''
        },
        managerComponentData: {
            type: Object,
            value: {},
            observer(newValue) {
                this.setData({
                    ...newValue
                });
            }
        }
    },
    data: {
        user: {}
    },
    methods: {
        async bindGetUserInfo(e) {
            const { encryptedData, iv } = e.detail;
            const user = await getAgainUserForInvalid({ encryptedData, iv });
            this.setData({
                user: user
            });
            console.log(this.data);
        },
        callManager(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },
        callServicer(e) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone
            });
        },
        closeModal() {
            this.setData({
                openManager: false
            });
        }
    }
});

