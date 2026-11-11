import { defineConfig } from 'vite-plus';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import AutoImport from 'unplugin-auto-import/vite';

const config = defineConfig(({ command }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    ...(command === 'serve' ? [devtools()] : []),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    react({ compiler: true }),
    AutoImport({
      imports: [
        'react',
        {
          '@tanstack/react-router': ['Link', 'useNavigate', 'useParams', 'useSearch', 'Outlet', 'useRouter'],
        },
      ],
      include: [/\.[jt]sx?$/, /tsr-split/],
      dirs: [
        './src/lib',
        './src/hooks',
        './src/icons',
        '../../packages/utils/src/index.ts',
        '../../packages/ui/components',
      ],
    }),
  ],
}));

export default config;