import { IonFooter } from '@ionic/react';

export function Footer() {
  return (
    <>
      <IonFooter
        className="ion-no-border"
        style={{
          textAlign: 'center',
          background: 'var(--ion-background-color)',
          position: 'stick y',
          bottom: 0,
        }}
      ></IonFooter>
    </>
  );
}
