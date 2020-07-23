module.exports = {
  // extends: [require.resolve('@umijs/fabric/dist/eslint')],
  extends: ['@finance/eslint-config-loan/react-typescript', 'prettier'],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
    APP_ENV: true
  },
  rules: {
    'import/no-cycle': 'off',
    '@typescript-eslint/consistent-type-assertions': ['off'],
    'import/extensions': ['.tsx', 'always']
  }
}
