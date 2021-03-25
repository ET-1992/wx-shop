import { getUserProfile } from 'utils/util';
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
        },
        themeColor: {
            type: Object,
            value: {}
        }
    },
    data: {
        user: {}
    },
    methods: {
        async bindGetUserInfo() {
            const user = await getUserProfile();
            this.setData({
                user: user
            });
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

