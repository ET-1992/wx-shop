module.exports = {
  extends: ['cantonjs-resolver'],
  // rules: {
  // 	"comma-dangle": ["error", "only-multiline"],
  // },
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
};
