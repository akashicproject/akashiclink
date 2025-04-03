import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { themeType } from '../../theme/const';
import { useTheme } from '../PreferenceProvider';

const WordItem = styled(IonItem)`
  height: 40px;
  width: 100px;
  &::part(native) {
    height: 16px;
    padding: 0;
    background-color: transparent;
  }
`;

const WordNumber = styled(IonLabel)`
  font-size: 8px !important;
  width: 12px;
  margin: 0;
  opacity: 1 !important;
`;

type WordInputProps = {
  fillable: boolean;
};

const WordInput = styled(IonInput)<WordInputProps>`
  border-radius: 8px;
  border: ${(props) =>
    props.fillable ? '2px solid var(--ion-color-light)' : '1px solid #7B757F'};
  font-size: 10px;
  text-align: center;
  input {
    height: 24px;
    width: 64px;
    padding: 8px !important;
    &:disabled {
      opacity: 1 !important;
    }
  }
`;

const ActionButton = styled(IonButton)`
  font-size: 10px;
  font-weight: 700;
  text-transform: none;
  color: var(--ion-color-primary-shade);
`;

type MaskContainerProps = {
  isHidden: boolean;
};

const MaskContainer = styled.div<MaskContainerProps>`
  border-radius: 8px;
  background-color: ${(props) =>
    props.isHidden ? 'rgba(103, 80, 164, 0.08)' : 'none'};
  position: relative;
`;

const MaskBlurContainer = styled.div<MaskContainerProps>`
  filter: ${(props) => (props.isHidden ? 'blur(4px)' : 'none')};
`;

const MaskLabelContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: var(--ion-color-primary);
  ion-label {
    font-weight: 700;
    font-size: 10px;
  }
`;

const StyledIonRow = styled(IonRow)`
  justify-content: 'space-between';
  width: '100%';
  text-align: 'center';
`;

const StyledIonIcon = styled(IonIcon)`
  font-size: '12px';
  color: 'var(--ion-color-primary-shade)!important';
`;
/**
 * 12 words inputs
 * initialWords => array of 12 strings
 * onChange => return an array of 12 string
 * withAction => with copy and reveal or not
 */
export function SecretWords({
  initialWords,
  onChange,
  withAction,
}: {
  initialWords: string[];
  onChange?: (words: string[]) => void;
  withAction?: boolean;
}) {
  const { t } = useTranslation();
  const [words, setWords] = useState(initialWords);
  const [isHidden, setIsHidden] = useState(withAction ? true : false);
  const [storedTheme] = useTheme();
  const handleCopy = async (e: never) => {
    await Clipboard.write({
      string: words.join(' ') || '',
    });

    if (popover.current) popover.current.event = e;
    setPopoverOpen(true);
    setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  const popover = useRef<HTMLIonPopoverElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const onInputChange = async (
    value: string | number | null | undefined,
    i: number
  ) => {
    const newWords = [
      ...words.slice(0, i),
      value?.toString() || '',
      ...words.slice(i + 1),
    ];
    setWords(newWords);
    onChange && onChange(newWords);
  };

  const onHiddenBtnClick = () => {
    setIsHidden(!isHidden);
  };

  return (
    <>
      <MaskContainer isHidden={isHidden}>
        {isHidden && (
          <MaskLabelContainer>
            <IonIcon icon={eyeOutline}></IonIcon>
            <IonLabel>{t('MakeSureNoBodyIsLooking')}</IonLabel>
          </MaskLabelContainer>
        )}
        <MaskBlurContainer isHidden={isHidden}>
          <IonGrid>
            <IonRow>
              {initialWords.map((initialWord, i) => {
                return (
                  <IonCol size="4" key={i}>
                    <WordItem lines={'none'}>
                      <WordNumber>{i + 1}.</WordNumber>
                      <WordInput
                        value={words[i]}
                        disabled={initialWord !== ''}
                        fillable={initialWord === ''}
                        onIonInput={({ target: { value } }) =>
                          onInputChange(value, i)
                        }
                      ></WordInput>
                    </WordItem>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        </MaskBlurContainer>
      </MaskContainer>
      {withAction && (
        <StyledIonRow>
          <IonCol size={'5'}>
            <ActionButton fill="clear" onClick={onHiddenBtnClick}>
              <IonIcon
                slot="start"
                icon={isHidden ? eyeOutline : eyeOffOutline}
              ></IonIcon>
              {isHidden ? t('RevealRecoveryPhase') : t('HideRecoveryPhase')}
            </ActionButton>
          </IonCol>
          <IonCol offset={'1'} size={'6'}>
            <ActionButton fill="clear" onClick={handleCopy}>
              <StyledIonIcon
                slot="icon-only"
                src={`/shared-assets/images/${
                  storedTheme === themeType.DARK
                    ? 'copy-icon-secret-dark.svg'
                    : 'copy-icon-secret-white.svg'
                }`}
              />
              {t('CopyToClipboard')}
            </ActionButton>
            <IonPopover
              side="top"
              alignment="center"
              ref={popover}
              isOpen={popoverOpen}
              class={'copied-popover'}
              onDidDismiss={() => setPopoverOpen(false)}
            >
              <IonContent class="ion-padding">{t('Copied')}</IonContent>
            </IonPopover>
          </IonCol>
        </StyledIonRow>
      )}
    </>
  );
}
