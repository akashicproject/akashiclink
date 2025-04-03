import type { ReactNode } from 'react';

import { LoggedLayout } from '../../components/layout/logged-layout';

export const SendMain: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <LoggedLayout showAddress>{children}</LoggedLayout>;
};
