module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['eslint-plugin-n8n-nodes-base'],
  rules: {
    // Stricter rules for prepublish
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'no-console': 'error',
  },
};
