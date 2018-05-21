module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:promise/recommended",
    "plugin:node/recommended",
    "standard",
    "prettier",
    "prettier/standard"
  ],
  globals: {
    fetch: true,
    WebAssembly: true
  },
  rules: {
    "no-console": "warn",
    "no-multi-spaces": "off",
    "comma-dangle": "off",
    "node/no-unpublished-require": "off",
    "promise/always-return": "off"
  }
};
