module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
    'prettier/prettier': true,
  },
};
