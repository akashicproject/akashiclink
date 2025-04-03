import { IonHeader, IonImg, IonToggle } from '@ionic/react';

export function LoggedHeader() {
  return (
    <>
      <IonHeader
        className="ion-no-border"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#5B299C',
          gap: '160px',
          height: '72px',
        }}
      >
        <IonImg
          alt={''}
          src="/shared-assets/images/layout/logged-icon.png"
          style={{ width: '75px', height: '30px' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <IonImg
            alt={''}
            src="/shared-assets/images/layout/avatar.png"
            style={{ width: '40px', height: '40px' }}
          />
          <IonToggle />
        </div>
      </IonHeader>
    </>
  );
}
