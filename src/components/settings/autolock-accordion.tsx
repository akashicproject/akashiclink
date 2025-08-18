import { IonRadioGroup } from '@ionic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../redux/app/hooks';
import {
  selectAutoLockTime,
  setAutoLockTime,
} from '../../redux/slices/preferenceSlice';
import { DownArrow } from './down-arrow';
import { ForwardArrow } from './forward-arrow';
import { SettingsRadio } from './setting-radio';

const autoLockTimeMap: AutoLockProp[] = [
  {
    label: '10',
    unit: 'minutes',
    value: 10,
  },
  {
    label: '30',
    unit: 'minutes',
    value: 30,
  },
  {
    label: '1',
    unit: 'hour',
    value: 60,
  },
  {
    label: '2',
    unit: 'hours',
    value: 60 * 2,
  },
  {
    label: '4',
    unit: 'hours',
    value: 60 * 4,
  },
  {
    label: '8',
    unit: 'hours',
    value: 60 * 8,
  },
];

type AutoLockProp = {
  label: string;
  unit: string;
  value: number;
};

export const AutoLockTextCaret = ({
  showAccordionItem,
}: {
  showAccordionItem?: boolean;
}) => {
  const { t } = useTranslation();
  const autoLockTime = useAppSelector(selectAutoLockTime);

  const currentAutoLockTime =
    autoLockTimeMap.find((e) => {
      if (e.value === autoLockTime) {
        return e;
      }
    }) ?? autoLockTimeMap[0];

  return (
    <>
      <h5 className="ion-no-margin ion-text-size-xs ion-margin-right-xs">
        {`${currentAutoLockTime.label} ${t(currentAutoLockTime.unit)}`}
      </h5>
      {showAccordionItem ? <DownArrow /> : <ForwardArrow />}
    </>
  );
};

export const AutoLockAccordion = () => {
  const { t } = useTranslation();
  const autoLockTime = useAppSelector(selectAutoLockTime);
  const dispatch = useAppDispatch();

  const currentAutoLockTime =
    autoLockTimeMap.find((e) => {
      if (e.value === autoLockTime) {
        return e;
      }
    }) ?? autoLockTimeMap[0];

  const [autoLock, setAutoLock] = useState<AutoLockProp>(currentAutoLockTime);

  return (
    <IonRadioGroup
      value={autoLock.value}
      className="ion-padding-top-0 ion-padding-bottom-0 ion-padding-left-xs ion-padding-right-xs"
    >
      {autoLockTimeMap.map((item) => (
        <SettingsRadio
          key={item.value}
          labelPlacement="end"
          justify="start"
          value={item.value}
          onClick={() => {
            setAutoLock(item);
            dispatch(setAutoLockTime(item.value));
          }}
          width={'33.33%'}
          mode="md"
        >
          <h5 className="ion-no-margin">{`${item.label} ${t(item.unit)}`}</h5>
        </SettingsRadio>
      ))}
    </IonRadioGroup>
  );
};
