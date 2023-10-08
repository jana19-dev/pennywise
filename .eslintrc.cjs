module.exports = {
  root: true,
  extends: [`eslint:recommended`, `plugin:svelte/recommended`, `plugin:prettier/recommended`],
  parserOptions: {
    sourceType: `module`,
    ecmaVersion: `latest`,
    extraFileExtensions: [`.svelte`]
  },
  env: {
    browser: true,
    node: true,
    es2024: true
  },
  rules: {
    quotes: [`error`, `backtick`]
  }
}
