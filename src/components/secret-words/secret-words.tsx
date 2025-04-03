import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
  IonPopover,
  IonRow,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WordCol = styled(IonCol)`
  --ion-padding: 4px;
`;

const WordItem = styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
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
    props.fillable ? '2px solid #c297ff' : '1px solid #7B757F'};
  font-size: 10px;
  text-align: center;
  color: var(--ion-color-primary-10);
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

const StyledIonIcon = styled(IonIcon)`
  font-size: 12px;
  height: 20px;
  width: 20px;
  margin-right: 4px;
`;

const CopyActionButton = styled.div`
  display: flex;
  justify-content: end;
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
  inputVisibility = false,
  disableInput = true,
}: {
  initialWords: string[];
  onChange?: (words: string[]) => void;
  withAction?: boolean;
  inputVisibility?: boolean;
  disableInput?: boolean;
}) {
  const { t } = useTranslation();
  const [words, setWords] = useState(initialWords);
  const [isHidden, setIsHidden] = useState(withAction ? true : false);
  const [visibilityArray, setVisibility] = useState<boolean[]>(
    new Array(initialWords.length).fill(!inputVisibility) as boolean[]
  );

  useEffect(() => {
    setWords(initialWords);
  }, [initialWords]);
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

  const onInputChange = async (value: string | null | undefined, i: number) => {
    const sWords = value?.split(' ');
    let newWords = [];
    if (sWords?.length === 12) {
      newWords = sWords;
    } else {
      newWords = [
        ...words.slice(0, i),
        value?.toString() || '',
        ...words.slice(i + 1),
      ];
    }
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
            <IonIcon
              src={`/shared-assets/images/visibility.svg`}
              style={{ height: '20px', width: '20px' }}
            ></IonIcon>
            <IonLabel>{t('MakeSureNoBodyIsLooking')}</IonLabel>
          </MaskLabelContainer>
        )}
        <MaskBlurContainer isHidden={isHidden}>
          <IonGrid>
            <IonRow>
              {visibilityArray.map((visibility, i) => {
                return (
                  <WordCol size="4" key={i} class="ion-padding-horizontal">
                    <WordItem>
                      <WordNumber>{i + 1}.</WordNumber>
                      <WordInput
                        id={`wordInput-${i}`}
                        value={words[i]}
                        type={visibility ? 'text' : 'password'}
                        disabled={disableInput ? initialWords[i] !== '' : false}
                        fillable={disableInput ? initialWords[i] === '' : true}
                        onIonChange={({ target: { value } }) =>
                          onInputChange(value as string, i)
                        }
                      ></WordInput>
                      {inputVisibility && (
                        <IonIcon
                          src={`/shared-assets/images/visibility-${
                            visibility ? 'on' : 'off'
                          }.svg`}
                          onClick={() => {
                            visibilityArray[i] = !visibility;
                            setVisibility([...visibilityArray]);
                          }}
                          style={{
                            cursor: 'pointer',
                            height: '10px',
                            width: '10px',
                            marginLeft: '4px',
                          }}
                        />
                      )}
                    </WordItem>
                  </WordCol>
                );
              })}
            </IonRow>
          </IonGrid>
        </MaskBlurContainer>
      </MaskContainer>
      {withAction && (
        <IonGrid>
          <IonRow class="ion-justify-content-between">
            <IonCol size={'6'}>
              <ActionButton fill="clear" onClick={onHiddenBtnClick}>
                <StyledIonIcon
                  src={`/shared-assets/images/visibility-${
                    isHidden ? 'off-color' : 'on'
                  }.svg`}
                  style={{
                    height: '20px',
                    width: '20px',
                    marginRight: '4px',
                  }}
                />

                {isHidden ? t('RevealRecoveryPhase') : t('HideRecoveryPhase')}
              </ActionButton>
            </IonCol>
            <IonCol size={'6'}>
              <CopyActionButton>
                <ActionButton fill="clear" onClick={handleCopy}>
                  <StyledIonIcon
                    slot="icon-only"
                    src={`/shared-assets/images/copy-icon-secret-white.svg`}
                  />
                  {t('CopyToClipboard')}
                </ActionButton>
                <IonPopover
                  side="top"
                  alignment="center"
                  ref={popover}
                  isOpen={popoverOpen}
                  className={'copied-popover'}
                  onDidDismiss={() => setPopoverOpen(false)}
                >
                  <IonContent class="ion-padding">{t('Copied')}</IonContent>
                </IonPopover>
              </CopyActionButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </>
  );
}
