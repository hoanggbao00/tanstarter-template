import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 120,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    ignorePatterns: ['**/_generated/**'],
  },
  lint: { options: { typeAware: true, typeCheck: true }, ignorePatterns: ['**/_generated/**'] },
  run: {
    cache: true,
  },
});