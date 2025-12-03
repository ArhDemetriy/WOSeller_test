export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    'order/properties-alphabetical-order': true,
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$',
      {
        message: 'Use camelCase or BEM naming: block__element--modifier',
      },
    ],
    'no-descending-specificity': null,
  },
};
