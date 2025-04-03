import styled from '@emotion/styled';
import { IonCol, IonImg, IonRow } from '@ionic/react';
import { useTranslation } from 'react-i18next';

import { PurpleButton } from '../../components/common/buttons';
import { MainGrid } from '../../components/layout/main-grid';
import { PublicLayout } from '../../components/page-layout/public-layout';
import { useAppDispatch } from '../../redux/app/hooks';
import { onClear } from '../../redux/slices/importWalletSlice';
import { historyResetStackAndRedirect } from '../../routing/history';
import { useOwner } from '../../utils/hooks/useOwner';

export const StyledSpan = styled.span({
  fontSize: '12px',
  fontWeight: '700',
  color: 'var(--ion-color-primary-10)',
  marginTop: '4px',
  lineHeight: '16px',
});
export const ImportWalletSuccessful = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { mutateOwner } = useOwner();

  const handleOnConfirm = async () => {
    dispatch(onClear());
    await mutateOwner();
    // migration flow is finished, completely reset router history
    historyResetStackAndRedirect();
  };

  return (
    <PublicLayout className="vertical-center">
      <MainGrid>
        <IonRow className={'ion-grid-row-gap-md ion-center'}>
          <IonCol size={'12'} className={'ion-center'}>
            <IonImg
              alt={''}
              src={'/shared-assets/images/right.png'}
              style={{ width: '40px', height: '40px' }}
            />
          </IonCol>
          <IonCol size={'12'} className={'ion-center'}>
            <h3
              className={
                'ion-margin-0 ion-margin-bottom-lg ion-text-align-center'
              }
            >
              {t('ImportSuccessful')}
            </h3>
          </IonCol>
          <IonCol size={'6'}>
            <PurpleButton expand="block" onClick={handleOnConfirm}>
              {t('Confirm')}
            </PurpleButton>
            {/** TODO: Re-enable with different flow at later stage */}
            {/* <Divider/>>
            <StyledSpan>{t('YouHaveOptionTo')}</StyledSpan>
            <WhiteButton
              onClick={() => {
                history.push(akashicPayPath(urls.changePasswordAfterImport));
              }}
            >
              {t('ChangePassword')}
            </WhiteButton> */}
          </IonCol>
        </IonRow>
      </MainGrid>
    </PublicLayout>
  );
};
