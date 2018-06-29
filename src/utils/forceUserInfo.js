import getUserInfo from 'utils/getUserInfo';
import api from 'utils/api';
import { USER_KEY } from 'constants/index';

export default async function forceUserInfo(options) {
    const { encryptedData, iv } = options;
    let user = getUserInfo();

    if (!user) {
        const data = await api.hei.getUserInfo({
            encrypted_data: encryptedData,
            iv,
        });
        user = data.user;
        wx.setStorageSync(USER_KEY, data.user);
    }
    return user;
}
