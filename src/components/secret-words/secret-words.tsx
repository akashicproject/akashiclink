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
import { copyOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WordItem = styled(IonItem)`
  &::part(native) {
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
    padding: 8px !important;
    &:disabled {
      opacity: 1 !important;
    }
  }
`;

const ActionButton = styled(IonButton)`
  font-size: 10px;
  font-weight: 700;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
    const { value: clipboardContent } = await Clipboard.read();
    if (
      clipboardContent.split(' ').length === 12 &&
      value === clipboardContent
    ) {
      // Here we check if we are doing pasting
      // By checking the input with the content in clipboard
      // If pasted we separate the content to 12 words
      // And update each field accordingly
      setWords(clipboardContent.split(' '));
      onChange && onChange(clipboardContent.split(' '));
    } else {
      const newWords = [
        ...words.slice(0, i),
        value?.toString() || '',
        ...words.slice(i + 1),
      ];
      setWords(newWords);
      onChange && onChange(newWords);
    }
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
              {initialWords.map((initialWord, i) => (
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
              ))}
            </IonRow>
          </IonGrid>
        </MaskBlurContainer>
      </MaskContainer>
      {withAction && (
        <ActionContainer>
          <ActionButton fill="clear" onClick={onHiddenBtnClick}>
            <IonIcon
              slot="start"
              icon={isHidden ? eyeOutline : eyeOffOutline}
            ></IonIcon>
            {isHidden ? t('RevealRecoveryPhase') : t('HideRecoveryPhase')}
          </ActionButton>
          <ActionButton fill="clear" onClick={handleCopy}>
            <IonIcon slot="start" icon={copyOutline}></IonIcon>
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
        </ActionContainer>
      )}
    </>
  );
}
