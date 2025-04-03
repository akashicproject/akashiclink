import { IonHeader, IonImg } from '@ionic/react';

export function MainHeader() {
  return (
    <>
      <IonHeader
        className="ion-no-border"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F3F5F6',
        }}
      >
        <IonImg
          alt={''}
          src="/shared-assets/images/layout/layout-icon.png"
          style={{ width: '75px', height: '40px', marginTop: '40px' }}
        />
      </IonHeader>
    </>
  );
}
