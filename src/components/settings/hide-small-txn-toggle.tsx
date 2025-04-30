import React from 'react';

import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { HIDE_SMALL_BALANCES } from '../../utils/preference-keys';
import { Toggle } from '../common/toggle/toggle';

export const HideSmallTxnToggle = () => {
  const { value, setValue } = useLocalStorage(HIDE_SMALL_BALANCES, true);

  return (
    <div style={{ width: '60px' }}>
      <Toggle
        currentState={value ? 'active' : 'inActive'}
        onClickHandler={() => {
          setValue(!value);
        }}
      />
    </div>
  );
};
