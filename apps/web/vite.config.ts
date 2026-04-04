import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import babel from '@rolldown/plugin-babel';
import AutoImport from 'unplugin-auto-import/vite';

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    AutoImport({
      imports: [
        'react',
        {
          '@tanstack/react-router': ['Link', 'useNavigate', 'useParams', 'useSearch', 'Outlet', 'useRouter'],
        },
      ],
      include: [/\.[jt]sx?$/, /tsr-split/],
      dirs: ['./src/lib', './src/hooks', './src/icons', './src/utils'],
    }),
  ],
});

export default config;
