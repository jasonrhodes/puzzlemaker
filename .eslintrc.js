module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ["react", "jest"],
  rules: {
    "jest/expect-expect": "off",
    "react/prop-types": "off",
    "react/no-children-prop": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
