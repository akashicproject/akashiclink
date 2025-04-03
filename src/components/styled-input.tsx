import './styled-input.css';

import type { TextFieldTypes } from '@ionic/core';
import type { IonInputCustomEvent } from '@ionic/core/dist/types/components';
import { IonInput, IonItem, IonLabel } from '@ionic/react';

interface Props {
  label: string;
  type: TextFieldTypes;
  placeholder: string;
  onIonInput?: (event: IonInputCustomEvent<InputEvent>) => void;
}

export const StyledInput: React.FC<Props> = (props: Props) => {
  return (
    <IonItem class={'styled-item'}>
      <IonLabel class={'styled-label'} position={'stacked'}>
        {props.label}
      </IonLabel>
      <IonInput
        type={props.type}
        placeholder={props.placeholder}
        class={'styled-input'}
        onIonInput={props.onIonInput}
      ></IonInput>
    </IonItem>
  );
};
