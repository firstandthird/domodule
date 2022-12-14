module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  extends: ["firstandthird", "plugin:import/recommended", "prettier"],
  plugins: ["compat", "import", "jest"],
  root: true,
  rules: {
    "compat/compat": 2,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
};
