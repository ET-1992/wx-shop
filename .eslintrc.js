module.exports = {
  extends: [
    'eslint-config-alloy',
  ],
  "globals": {
    "__DEV__": true,
    "__WECHAT__": true,
    "__ALIPAY__": true,
    "App": true,
    "Page": true,
    "wx": true,
    "getApp": true,
    "getCurrentPages": true,
    "Component": true
  },
  rules: {
    'no-tabs': 0,
    'no-unused-vars': [
      0,
      {
          vars: 'all',
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true
      }
    ],
    'one-var': 0,
    'array-callback-return': 1,
    'guard-for-in': 0,
    'complexity': 0
  }
};
