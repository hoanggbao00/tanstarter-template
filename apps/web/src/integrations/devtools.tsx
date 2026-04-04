import { TanStackDevtools, type TanStackDevtoolsReactInit } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

interface Props {
  config?: TanStackDevtoolsReactInit['config'];
}

export const Devtools = ({ config }: Props) => {
  return (
    <TanStackDevtools
      config={config}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
        {
          name: 'Tanstack Query',
          render: <ReactQueryDevtoolsPanel />,
        },
      ]}
    />
  );
};
