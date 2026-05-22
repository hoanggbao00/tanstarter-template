import { GooeyToaster, GooeyToasterProps, gooeyToast } from 'goey-toast';
import { IconCircleCheck, IconInfoCircle, IconAlertTriangle, IconAlertOctagon, IconLoader } from '@tabler/icons-react';
import { useTheme } from '../lib/theme-provider';

export { gooeyToast as toast };

const Toaster = ({ ...props }: GooeyToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <GooeyToaster
      theme={theme as GooeyToasterProps['theme']}
      position="top-center"
      duration={2000}
      visibleToasts={4}
      {...props}
    />
  );
};

export default Toaster;