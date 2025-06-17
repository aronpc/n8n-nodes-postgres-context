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
    // Add any specific rules here
  },
};
