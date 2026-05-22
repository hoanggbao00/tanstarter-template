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
    ignorePatterns: ['**/_generated/**', '**/*.d.ts', 'routeTree.gen.ts'],
  },
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ['**/_generated/**', '**/*.d.ts', 'routeTree.gen.ts'],
  },
  run: {
    cache: true,
  },
});