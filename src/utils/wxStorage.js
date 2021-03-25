const wxStorage = {
    get(key) {
        return wx.getStorageSync(key);
    },

    getExpiredTime(key) {
        return wx.getStorageSync(key + '_ExpiredTime');
    },

    isExpired(key) {
        const timestamp = new Date().getTime();

        const expiredTime = this.getExpiredTime(key);
        console.log(timestamp, expiredTime);
        if (expiredTime && expiredTime > timestamp) {
            return false;
        }
        return true;
    },

    clear(key) {
        wx.clearStorage(key);
        wx.clearStorage(key + '_ExpiredTime');
    },

    set({ key, value, expiredTime, mode = 'timeStamp' }) {

        if (!key || typeof key !== 'string') {
            throw new Error('please input the true key!');
        }

        if (value) {
            wx.setStorageSync(key, value);
        }

        if (expiredTime) {
            if (mode === 'second') {
                wx.setStorageSync(key + '_ExpiredTime', new Date().getTime() + expiredTime);
            }
            else {
                wx.setStorageSync(key + '_ExpiredTime', expiredTime);
            }
        }

    }
};
export default wxStorage;