import { Clipboard } from '@capacitor/clipboard';
import styled from '@emotion/styled';
import {
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

import { CopyIcon } from '../common/icons/copy-icon';
import { VisibilityOnIcon } from '../common/icons/visibility-on-icon';

const WordCol = styled(IonCol)`
  --ion-padding: 4px;
`;

const WordItem = styled.div`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const WordNumber = styled(IonLabel)`
  text-align: right;
  font-size: 0.5rem !important;
  width: 12px;
  margin: 0;
  opacity: 1 !important;
  color: var(--ion-color-primary-10);
`;

type WordInputProps = {
  fillable: boolean;
  inputVisibility: boolean;
};

const WordInput = styled(IonInput)<WordInputProps>`
   && {
    border-radius: 8px;
    border: ${(props) =>
      !props.inputVisibility && props.fillable
        ? '2px solid var(--ion-color-primary-70)'
        : '1px solid var(--ion-color-grey)'};
    font-size: 0.625rem;
    text-align: center;
    color: var(--ion-color-primary-10);
    width: 64px;
    margin-left: 4px;
    min-height: 24px !important;
    opacity: unset !important;
    --highlight-color-focused: none;
    input {
      height: 24px;
      padding: 8px !important;
      &:disabled {
        opacity: 1 !important;
      }
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
  gap: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  color: var(--secret-word-text);
  ion-label {
    font-weight: 700;
  }
  z-index: 1;
`;

const CopyClipBoardLabel = styled(IonLabel)`
  color: var(--secret-word-text);
  font-weight: 700;
  font-size: 0.625rem;
  align-items: center;
  display: flex;
  cursor: pointer;
  gap: 4px;
`;
const CopyActionButton = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
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
  onHiddenChange,
}: {
  initialWords: string[];
  onChange?: (words: string[]) => void;
  withAction?: boolean;
  inputVisibility?: boolean;
  disableInput?: boolean;
  onHiddenChange?: (isSecretPhraseHidden: boolean) => void;
}) {
  const { t } = useTranslation();

  const [words, setWords] = useState(initialWords);
  const [isHidden, setIsHidden] = useState(withAction ? true : false);
  const [visibilityArray, setVisibilityArray] = useState<boolean[]>(
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
    let newWords: string[] = [];
    if (sWords?.length === 12) {
      if (words.length) {
        words.forEach((w, i) => {
          if (!w) {
            newWords[i] = sWords[i];
          } else {
            newWords[i] = words[i];
          }
        });
      } else {
        newWords = sWords;
      }
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
    onHiddenChange && onHiddenChange(!isHidden);
    setIsHidden(!isHidden);
  };

  return (
    <>
      <MaskContainer isHidden={isHidden}>
        {isHidden && (
          <MaskLabelContainer onClick={onHiddenBtnClick}>
            <VisibilityOnIcon style={{ height: '20px', width: '20px' }} />
            <IonLabel className="ion-text-size-xxs">
              {t('MakeSureNoBodyIsLooking')}
            </IonLabel>
            <IonLabel
              className="ion-text-size-sm ion-text-underline"
              style={{
                cursor: 'pointer',
              }}
            >
              {t('PressToReveal')}
            </IonLabel>
          </MaskLabelContainer>
        )}
        <MaskBlurContainer isHidden={isHidden}>
          <IonGrid className="ion-grid-gap-xxxs ion-no-padding">
            <IonRow>
              {visibilityArray.map((visibility, i) => {
                return (
                  // ok because the array has 12 ordered elements, mapping to the 12 words
                  // eslint-disable-next-line sonarjs/no-array-index-key
                  <WordCol size="4" key={i} class="ion-padding-horizontal">
                    <WordItem>
                      <WordNumber>{i + 1}.</WordNumber>
                      <WordInput
                        aria-label={`${i + 1}`}
                        id={`wordInput-${i}`}
                        value={words[i]}
                        type={visibility ? 'text' : 'password'}
                        inputVisibility={inputVisibility}
                        disabled={disableInput ? initialWords[i] !== '' : false}
                        fillable={disableInput ? initialWords[i] === '' : true}
                        onIonInput={({ detail: { value } }) =>
                          onInputChange(value as string, i)
                        }
                      />
                      {inputVisibility && (
                        <IonIcon
                          src={`/shared-assets/images/visibility-${
                            visibility ? 'on' : 'off'
                          }-grey.svg`}
                          onClick={() => {
                            visibilityArray[i] = !visibility;
                            setVisibilityArray([...visibilityArray]);
                          }}
                          style={{
                            cursor: 'pointer',
                            height: '16px',
                            width: '16px',
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
        <IonRow className="ion-margin ion-center">
          <IonCol size={'6'}>
            <CopyActionButton>
              <CopyClipBoardLabel
                className="ion-no-margin"
                onClick={handleCopy}
              >
                <CopyIcon isDim size={20} slot="icon-only" />
                {t('CopyToClipboard')}
              </CopyClipBoardLabel>
              <IonPopover
                side="top"
                alignment="center"
                ref={popover}
                isOpen={popoverOpen}
                className={'copied-popover'}
                onDidDismiss={() => setPopoverOpen(false)}
              >
                <IonContent>{t('Copied')}</IonContent>
              </IonPopover>
            </CopyActionButton>
          </IonCol>
        </IonRow>
      )}
    </>
  );
}
