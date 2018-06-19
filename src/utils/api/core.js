import fetch from 'utils/fetch';

const createActions = ({ host, apis }) => {
    return Object.keys(apis).reduce((accum, key) => {
        const { path, isForceToken = false, method = 'GET', requestType = 'request', isForceUserInfo = false } = apis[key];
        const url = `${host}${path}`;

        accum[key] = (data = {}, options = {}) => {
            Object.assign(options, { isForceToken, isForceUserInfo, method, requestType });
            return fetch(url, data, options);
        };
        return accum;
    }, {});
};

export class API {
    constructor({ host, apis }) {
        return createActions({ host, apis });
    }
}
