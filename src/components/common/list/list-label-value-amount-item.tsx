import Big from 'big.js';
import { type FC, type ReactNode, useContext } from 'react';

import { getPrecision } from '../../../utils/formatAmount';
import { SendFormContext } from '../../send/send-modal-context-provider';
import {
  ListLabelValueItem,
  type ListLabelValueRowProps,
} from './list-label-value-item';

type ListLabelValueAmountItemProps = {
  label: string | number | ReactNode;
  value: string | number;
  amount: string;
  fee: string;
} & ListLabelValueRowProps;

export const ListLabelValueAmountItem: FC<ListLabelValueAmountItemProps> = ({
  label,
  amount,
  value,
  fee,
  ...props
}) => {
  const { currency } = useContext(SendFormContext);

  // fee is internal-fee here
  const precision = getPrecision(amount, fee ?? '0');

  return (
    <ListLabelValueItem
      label={label}
      value={
        <span style={{ lineHeight: '1.125rem' }}>
          <span>{Big(value).toFixed(precision)}</span>{' '}
          <span>{currency?.displayName}</span>
        </span>
      }
      labelBold
      {...props}
    />
  );
};
