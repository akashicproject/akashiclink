import './styled-input.css';

import { IonInput, IonItem, IonLabel } from '@ionic/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

type StyledInputProps = ComponentProps<typeof IonInput> & {
  label: string;
  placeholder: string;
  validate?: (value: string) => boolean;
};

/**
 * Standard input box with validation highlighting
 */
export function StyledInput({
  className,
  label,
  onIonInput,
  validate,
  ...props
}: StyledInputProps) {
  const [inputValid, setInputValid] = useState<boolean>();

  /** Set validation state based off user defined function */
  function validateInput(ev: Event) {
    if (!validate) return;

    const value = (ev.target as HTMLInputElement).value;
    setInputValid(undefined);
    if (value === '') return;
    validate(value) ? setInputValid(true) : setInputValid(false);
  }

  return (
    <IonItem class={'styled-item'} lines="none">
      <IonLabel class={'styled-label'} position={'stacked'}>
        {label}
      </IonLabel>
      <IonInput
        class="styled-input"
        className={`${!inputValid && 'fail'} ${className}`}
        onIonInput={(event) => {
          onIonInput && onIonInput(event);
          validateInput(event);
        }}
        {...props}
      ></IonInput>
    </IonItem>
  );
}
