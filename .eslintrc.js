module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: [
    "firstandthird",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  ignorePatterns: ["*.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: [
    "import",
    "compat",
    "jest",
    "@typescript-eslint/eslint-plugin",
    "tsdoc",
  ],
  root: true,
  rules: {
    "compat/compat": 2,
    "@typescript-eslint/no-explicit-any": "off",
    "tsdoc/syntax": "warn",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
