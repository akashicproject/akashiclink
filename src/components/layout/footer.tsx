import styled from '@emotion/styled';
import { IonFooter } from '@ionic/react';
import { useTranslation } from 'react-i18next';

const FooterText = styled.span({
  fontFamily: 'Nunito Sans',
  color: 'var(--ion-color-primary-10)',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: '700',
  ['a']: {
    color: '#7444B6',
  },
});

export function Footer() {
  const { t } = useTranslation();
  return (
    <>
      <IonFooter
        className="ion-no-border"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80px',
          background: 'var(--ion-background-color)',
        }}
      >
        <FooterText>
          {t('NeedHelp')} <a href={'url'}>{t('AkashicWalletSupport')}</a>
        </FooterText>
      </IonFooter>
    </>
  );
}
