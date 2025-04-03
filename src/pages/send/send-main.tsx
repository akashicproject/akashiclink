import type { ReactNode } from 'react';

import { LoggedLayout } from '../../components/layout/loggedLayout';

export const SendMain: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <LoggedLayout>{children}</LoggedLayout>;
};
