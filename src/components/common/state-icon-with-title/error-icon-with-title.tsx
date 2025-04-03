import { IonImg } from '@ionic/react';

export const ErrorIconWithTitle = ({
  title,
  className,
  size = 40,
}: {
  title: string;
  className?: string;
  size?: number;
}) => {
  return (
    <div
      className={`ion-display-flex ion-center ion-flex-direction-column ${
        className ?? ''
      }`}
    >
      <IonImg
        alt={''}
        src={'/shared-assets/images/wrong.png'}
        style={{ width: size, height: size }}
      />
      <h2
        className={
          'ion-text-align-center ion-text-size-md ion-margin-bottom-0 ion-margin-top-sm'
        }
      >
        {title}
      </h2>
    </div>
  );
};
