import { HeadContent, ScriptOnce, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { Devtools } from '@/integrations/devtools';
import appCss from '../styles.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from '@repo/ui/lib/theme-provider';
import { Toaster } from '@repo/ui/components/sonner';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: ROOT_SEO,
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
});

export function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        {/* Apply theme early to avoid FOUC */}
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
        <Devtools />
        <Scripts />
      </body>
    </html>
  );
}
