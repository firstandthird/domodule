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
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["compat", "import", "jest", "@typescript-eslint"],
  root: true,
  rules: {
    "compat/compat": 2,
    "@typescript-eslint/no-explicit-any": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
