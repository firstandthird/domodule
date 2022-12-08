module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    "firstandthird",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["compat", "jest", "@typescript-eslint"],
  root: true,
  rules: {
    "compat/compat": 2,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
