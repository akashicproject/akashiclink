import './send.css';

import styled from '@emotion/styled';
import { IonCol, IonImg, IonInput, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton, WhiteButton } from '../../components/buttons';
import { DividerDivWithoutMargin } from '../../components/layout/divider';
import { SendMain } from './send-main';

const HeaderWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: '29px',
  height: '40px',
  width: '339px',
});

const AvatarWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  height: '40px',
  width: '138px',
});

const AvatarText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: '#290056',
});

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  gap: '24px',
  width: '270px',
});

const TextWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0px',
  width: '270px',
});

const TextTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#290056',
});

const TextLastTitle = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '24px',
  color: '#290056',
});

const TextContent = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '20px',
  color: '#290056',
});

const InputPasswordWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px',
  width: '270px',
  gap: '16px',
});

const InputPasswordText = styled.div({
  fontFamily: 'Nunito Sans',
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '14px',
  lineHeight: '20px',
  color: '#290056',
});

export function SendConfirm() {
  const { t } = useTranslation();
  return (
    <SendMain>
      <IonRow>
        <IonCol class="ion-center">
          <HeaderWrapper>
            <AvatarWrapper>
              <IonImg
                alt={''}
                src="/shared-assets/images/layout/avatar.png"
                style={{ width: '40px', height: '40px' }}
              />
              <AvatarText>0xa4w..29kj</AvatarText>
            </AvatarWrapper>
            <IonImg
              alt={''}
              src="/shared-assets/images/arrow-circle-right.png"
              style={{ width: '40px', height: '40px' }}
            />
            <AvatarWrapper>
              <IonImg
                alt={''}
                src="/shared-assets/images/layout/avatar2.png"
                style={{ width: '40px', height: '40px' }}
              />
              <AvatarText>I loveu.he</AvatarText>
            </AvatarWrapper>
          </HeaderWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <ContentWrapper>
            <TextWrapper>
              <TextTitle>0.000 ETH</TextTitle>
            </TextWrapper>
            <DividerDivWithoutMargin />
            <TextWrapper>
              <TextTitle>{t('SendTo')}</TextTitle>
              <TextContent>I love.he</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>Gas</TextTitle>
              <TextContent>...</TextContent>
            </TextWrapper>
            <TextWrapper>
              <TextTitle>{t('Total')}</TextTitle>
              <TextContent>...</TextContent>
            </TextWrapper>
            <TextWrapper style={{ marginTop: '-24px' }}>
              <TextLastTitle>{t('Amount')} + gas fee</TextLastTitle>
              <TextContent>...</TextContent>
            </TextWrapper>
            <DividerDivWithoutMargin />
          </ContentWrapper>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="ion-center">
          <InputPasswordWrapper>
            <InputPasswordText>{t('PleaseConfirm')}</InputPasswordText>
            <IonInput
              /** TODO: t('PleaseEnterYourPassword') is not correctly recognised as string - maybe be fixed in the translations refactor */
              placeholder={t('PleaseEnterYourPassword') as string}
              class="input-password"
            ></IonInput>
          </InputPasswordWrapper>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-between" style={{ marginTop: '24px' }}>
        <IonCol>
          <PurpleButton expand="block">{t('Confirm')}</PurpleButton>
        </IonCol>
        <IonCol>
          <WhiteButton expand="block">{t('GoBack')}</WhiteButton>
        </IonCol>
      </IonRow>
    </SendMain>
  );
}
