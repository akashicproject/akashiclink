import styled from '@emotion/styled';
import { IonButton, IonIcon, IonPopover } from '@ionic/react';
import { checkmarkOutline, chevronDownOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ViewModeButton = styled(IonButton)({
  margin: 0,
  fontSize: '16px',
  fontWeight: 700,
  textTransform: 'none',
  color: 'var(--ion-color-primary)',
  ['&::part(native)']: {
    padding: '0',
    background: 'transparent',
  },
  '& ion-icon': {
    marginLeft: '4px',
  },
});

const ViewModeOption = styled.div<{ isSelected: boolean }>(
  ({ isSelected }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    color: isSelected
      ? 'var(--ion-color-primary)'
      : 'var(--ion-color-on-surface-light)',
    backgroundColor: 'transparent',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
  })
);

export enum ViewMode {
  RemainingBalance = 'remainingBalance',
  GasFee = 'gasFee',
}

interface ViewModeDropdownProps {
  selectedMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewModeDropdown: React.FC<ViewModeDropdownProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const { t } = useTranslation();
  const [popoverEvent, setPopoverEvent] = useState<Event | undefined>(
    undefined
  );

  const openPopover = (e: React.MouseEvent) => {
    setPopoverEvent(e.nativeEvent);
  };

  const closePopover = () => {
    setPopoverEvent(undefined);
  };

  const handleModeSelect = (mode: ViewMode) => {
    onModeChange(mode);
    closePopover();
  };

  const viewModeOptions = [
    { label: t('Balance'), value: 'balance' as ViewMode },
    { label: t('GasFee'), value: 'gasFee' as ViewMode },
  ];

  const selectedLabel =
    viewModeOptions.find((option) => option.value === selectedMode)?.label ??
    t('Balance');

  return (
    <>
      <ViewModeButton fill="clear" onClick={openPopover}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          $<span>{selectedLabel}</span>
          <IonIcon icon={chevronDownOutline} style={{ fontSize: '16px' }} />
        </div>
      </ViewModeButton>
      <IonPopover
        event={popoverEvent}
        isOpen={!!popoverEvent}
        onDidDismiss={closePopover}
        arrow={false}
        style={{
          '--background': 'var(--ion-color-surface-container)',
          '--box-shadow': '0px 4px 12px rgba(0, 0, 0, 0.1)',
          '--min-width': '104px',
          '--max-width': '104px',
          '--offset-y': '10px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '4px',
            width: '104px',
            boxSizing: 'border-box',
          }}
        >
          {viewModeOptions.map((option) => (
            <ViewModeOption
              key={option.value}
              isSelected={selectedMode === option.value}
              onClick={() => handleModeSelect(option.value)}
            >
              <span>{option.label}</span>
              {selectedMode === option.value && (
                <IonIcon
                  icon={checkmarkOutline}
                  style={{
                    fontSize: '16px',
                    color: 'var(--ion-color-primary)',
                  }}
                />
              )}
            </ViewModeOption>
          ))}
        </div>
      </IonPopover>
    </>
  );
};
