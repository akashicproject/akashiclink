import './styled-input.scss';

import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type Translation from '../i18n/translation/en_US.json';

/**
 * Useful prompts to display to user for invalid input.
 * The prompt MUST exist in the Translation files in ../i18n/Translation/en_US.json
 */
export const StyledInputErrorPrompt: {
  [key: string]: keyof typeof Translation;
} = {
  Password: 'PasswordHelpText',
  ConfirmPassword: 'ConfirmPasswordHelpText',
  Email: 'EmailHelpText',
  Amount: 'AmountHelpText',
  Address: 'AddressHelpText',
  ActivationCode: 'ActivationCodeText',
} as const;

/**
 * @param label to show next to the input box
 * @param isHorizontal applies the "horizontal" style to input, with label on the left
 * @param validate method to trigger on user input
 * @param errorPrompt to display to user is validation fails
 * @param ...props any other parameters native to IonInput
 */
type StyledInputProps = ComponentProps<typeof IonInput> & {
  label?: string | null;
  isHorizontal?: boolean;
  validate?: (value: string) => boolean;
  errorPrompt?: typeof StyledInputErrorPrompt[keyof typeof StyledInputErrorPrompt];
  // Required to allow translations to be passed in e.g. t('ConfirmPassword')
  placeholder: string;
};

/**
 * Our styled input box, supporting validation, highlighting on error
 * and some common styles
 */
export function StyledInput({
  label,
  onIonInput,
  validate,
  isHorizontal = false,
  errorPrompt,
  ...props
}: StyledInputProps) {
  const [inputValid, setInputValid] = useState(true);
  const { t } = useTranslation();
  const helpText = errorPrompt ? t(errorPrompt) : t('InvalidInput');

  /**
   * Execute the user-supplied validation function
   * flagging error by highlighting the input box in red
   */
  function validateInput(ev: Event) {
    if (!validate) return;

    const value = (ev.target as HTMLInputElement).value;
    if (value === '') {
      setInputValid(true);
      return;
    }
    validate(value) ? setInputValid(true) : setInputValid(false);
  }

  return (
    <IonItem
      class={isHorizontal ? 'styled-input-horizontal' : 'styled-input'}
      lines="none"
    >
      {label ? (
        <IonLabel position={isHorizontal ? undefined : 'stacked'}>
          {label}
        </IonLabel>
      ) : null}
      <IonInput
        className={!inputValid && !isHorizontal ? 'input-fail' : 'null'}
        onIonInput={(event) => {
          onIonInput && onIonInput(event);
          validateInput(event);
        }}
        {...props}
      ></IonInput>
      <IonNote slot="error">{!inputValid ? helpText : ' '}</IonNote>
    </IonItem>
  );
}
