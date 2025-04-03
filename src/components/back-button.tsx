import { IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

export function BackButton() {
  const history = useHistory();
  return <IonButton onClick={() => history.goBack()}>Back</IonButton>;
}
