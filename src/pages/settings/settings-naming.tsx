import './settings-naming.scss';

import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import type {
  IAcnsResponse,
  IUpdateAcns,
  IUpdateAcnsUsingClientSideOtk,
  IVerifyUpdateAcnsResponse,
} from '@helium-pay/backend';
import {
  IonCol,
  IonGrid,
  IonImg,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountSelection } from '../../components/account-selection/account-selection';
import {
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import {
  PurpleButton,
  SquareWhiteButton,
  TabButton,
  WhiteButton,
} from '../../components/common/buttons';
import { SuccessfulIconWithTitle } from '../../components/common/state-icon-with-title/successful-icon-with-title';
import { MainGrid } from '../../components/layout/main-grid';
import { Tabs } from '../../components/layout/tabs';
import { DashboardLayout } from '../../components/page-layout/dashboard-layout';
import {
  CacheOtkContext,
  useTheme,
} from '../../components/providers/PreferenceProvider';
import { themeType } from '../../theme/const';
import { OwnersAPI } from '../../utils/api';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { useNftAcnsMe } from '../../utils/hooks/useNftAcnsMe';
import { displayLongText } from '../../utils/long-text';
import { signTxBody } from '../../utils/nitr0gen-api';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';

const enum View {
  edit = 'edit',
  list = 'list',
}

const OneAcnsWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

/** Container displaying information in row format */
function AcnsTextContainer({
  value,
  walletOrName,
}: {
  value?: string;
  walletOrName: 'Wallet' | 'AccountName';
}) {
  return (
    <div>
      <h4
        style={{
          fontSize: '8px',
          color: 'var(--ion-light-text)',
          margin: 0,
          textAlign: 'left',
        }}
      >
        {walletOrName}
      </h4>
      <h4
        style={{
          margin: 0,
          textAlign: 'left',
        }}
      >
        {value}
      </h4>
    </div>
  );
}

function AcnsName({ name }: { name: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',

        width: '130px',
        height: '40px',
        paddingLeft: '12px',
        paddingRight: '12px',

        borderRadius: '8px 0px 0px 8px',
        border: '1px solid #D9D9D9',
      }}
    >
      <AcnsTextContainer value={name} walletOrName="AccountName" />
    </div>
  );
}

const AcnsAddress = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  width: '180px',
  height: '40px',
  paddingLeft: '12px',

  border: '1px solid #D9D9D9',
  borderRadius: '0px 8px 8px 0px',
});

const ModelDiv = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  marginTop: '64px',
  padding: '0 40px',
});

const WarningText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '253px',
  height: '69px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#000',
});

const NoDataDiv = styled.div({
  fontSize: '16px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  lineHeight: '24px',
  color: 'var(--ion-color-primary-10)',
  width: '100%',
  textAlign: 'center',
});

export function SettingsNaming() {
  const { t } = useTranslation();
  const { cacheOtk } = useContext(CacheOtkContext);
  const { activeAccount } = useAccountStorage();
  const { acns, mutateNftAcnsMe } = useNftAcnsMe();
  const namedAcns = acns.filter((a) => !!a.value);

  const [view, setView] = useState(View.list);
  const [alert, setAlert] = useState(formAlertResetState);
  const [editAcns, setEditAcns] = useState(namedAcns[0]);
  const [selectedName, setSelectedName] = useState('');
  const [newValue, setNewValue] = useState(activeAccount!.identity);
  const [showEditToast, setShowEditToast] = useState(false);
  const [isConfirmModel, setIsConfirmModel] = useState(false);
  const [isResultModel, setIsResultModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storedTheme] = useTheme();

  const removeAcns = async (name: string) => {
    setLoading(true);
    try {
      await OwnersAPI.updateAcns({ name, newValue: null });
      const verifyUpdateAcnsResponse: IVerifyUpdateAcnsResponse =
        await OwnersAPI.verifyUpdateAcns({
          name: name,
        } as IUpdateAcns);

      // "Hack" used when signing nft transactions, identity must be something else than the otk identity
      const signerOtk = {
        ...cacheOtk!,
        identity: verifyUpdateAcnsResponse.nftAcnsStreamId,
      };
      const signedTx = await signTxBody(
        verifyUpdateAcnsResponse.txToSign,
        signerOtk
      );

      await OwnersAPI.updateAcnsUsingClientSideOtk({
        signedTx: signedTx,
        name: name,
      } as IUpdateAcnsUsingClientSideOtk);

      setIsConfirmModel(false);
      setIsResultModel(true);
    } catch (error) {
      datadogRum.addError(error);
      setAlert(errorAlertShell(unpackRequestErrorMessage(error)));
    } finally {
      await mutateNftAcnsMe();
      setLoading(false);
    }
  };

  const confirmUpdate = async () => {
    setLoading(true);
    try {
      await OwnersAPI.updateAcns({
        name: selectedName,
        newValue: newValue,
      });
      const verifyUpdateAcnsResponse: IVerifyUpdateAcnsResponse =
        await OwnersAPI.verifyUpdateAcns({
          name: selectedName,
          newValue: newValue,
        } as IUpdateAcns);

      // "Hack" used when signing nft transactions, identity must be something else than the otk identity
      const signerOtk = {
        ...cacheOtk!,
        identity: verifyUpdateAcnsResponse.nftAcnsStreamId,
      };

      const signedTx = await signTxBody(
        verifyUpdateAcnsResponse.txToSign,
        signerOtk
      );

      await OwnersAPI.updateAcnsUsingClientSideOtk({
        signedTx: signedTx,
        name: selectedName,
        newValue: newValue,
      } as IUpdateAcnsUsingClientSideOtk);

      setView(View.list);
      setShowEditToast(true);
    } catch (error) {
      datadogRum.addError(error);
      setAlert(errorAlertShell(unpackRequestErrorMessage(error)));
    } finally {
      await mutateNftAcnsMe();
      setLoading(false);
    }
  };

  const updateAcns = (acns: IAcnsResponse) => {
    setEditAcns(acns);
    setSelectedName(acns.name);
    setView(View.edit);
  };

  return (
    <DashboardLayout showToolbar={true} showBackButton={true}>
      <CustomAlert state={alert} />
      <Tabs>
        <TabButton
          style={{ width: '50%', marginInline: '0' }}
          id="edit"
          className="open"
          onClick={() => setView(View.list)}
        >
          {t('List')}
        </TabButton>
        <TabButton
          style={{ width: '50%', marginInline: '0' }}
          id={'nft'}
          onClick={() => setView(View.edit)}
        >
          {t('NewEdit')}
        </TabButton>
      </Tabs>
      <MainGrid className="force-center" style={{ maxWidth: '90%' }}>
        {view === View.list &&
          (namedAcns.length === 0 ? (
            <IonRow>
              <IonCol>
                <NoDataDiv>{t('NoData')}</NoDataDiv>
              </IonCol>
            </IonRow>
          ) : (
            <>
              {acns.map((oneAcns) => (
                <IonRow style={{ marginTop: '16px' }} key={oneAcns.name}>
                  <IonCol class="ion-center">
                    <OneAcnsWrapper>
                      <AcnsName name={displayLongText(oneAcns.name, 11)} />
                      <AcnsAddress>
                        <AcnsTextContainer
                          value={
                            oneAcns.value
                              ? displayLongText(oneAcns.value, 10)
                              : 'N/A'
                          }
                          walletOrName="Wallet"
                        />
                        <div>
                          <SquareWhiteButton
                            className="icon-button"
                            onClick={() => updateAcns(oneAcns)}
                            forceStyle={{
                              height: '24px',
                              width: '24px',
                              padding: '4px',
                            }}
                            style={{
                              paddingLeft: '12px',
                              minWidth: '24px',
                              minHeight: '24px',
                              height: 'auto',
                            }}
                          >
                            <IonImg
                              alt="edit"
                              src={`/shared-assets/icons/${
                                storedTheme === themeType.DARK
                                  ? 'pencil-dark-mode'
                                  : 'pencil'
                              }.svg`}
                            />
                          </SquareWhiteButton>
                          <SquareWhiteButton
                            className="icon-button"
                            onClick={() => {
                              setEditAcns(oneAcns);
                              setIsConfirmModel(true);
                            }}
                            disabled={!oneAcns.value}
                            forceStyle={{
                              height: '24px',
                              width: '24px',
                              padding: '4px',
                            }}
                            style={{
                              paddingLeft: '4px',
                              paddingRight: '8px',
                              minWidth: '24px',
                              minHeight: '24px',
                              height: 'auto',
                            }}
                          >
                            <IonImg
                              alt="edit"
                              src={`/shared-assets/icons/${
                                storedTheme === themeType.DARK
                                  ? 'trash-dark-mode'
                                  : 'trash'
                              }.svg`}
                            />
                          </SquareWhiteButton>
                        </div>
                      </AcnsAddress>
                    </OneAcnsWrapper>
                  </IonCol>
                </IonRow>
              ))}
            </>
          ))}
        {view === View.edit && (
          <IonGrid style={{ width: '270px' }}>
            <IonRow>
              <IonCol>
                <IonSelect
                  style={{
                    border: '1px solid var(--m-3-sys-dark-outline, #958E99)',
                    borderRadius: '8px',
                    padding: '6px 8px 6px 16px',
                    width: '100%',
                    height: '40px',
                  }}
                  value={selectedName}
                  interface="popover"
                  placeholder="Available names"
                  onIonChange={({ detail: { value } }) =>
                    setSelectedName(value)
                  }
                >
                  {acns.map((a) => (
                    <IonSelectOption key={a.name} value={a.name}>
                      {a.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              <IonCol>
                <AccountSelection
                  onNewAccountClick={(account) => setNewValue(account.identity)}
                  hideCreateImport={true}
                />
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '16px' }}>
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={() => confirmUpdate()}
                  disabled={loading || !selectedName}
                >
                  {t('Confirm')}
                  {loading ? (
                    <IonSpinner style={{ marginLeft: '10px' }}></IonSpinner>
                  ) : null}
                </PurpleButton>
              </IonCol>
              <IonCol>
                <WhiteButton
                  expand="block"
                  onClick={() => {
                    setView(View.list);
                  }}
                >
                  {t('Cancel')}
                </WhiteButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </MainGrid>
      <IonModal
        id="settings-model"
        isOpen={isConfirmModel}
        onDidDismiss={() => setIsConfirmModel(false)}
      >
        <ModelDiv>
          <IonImg
            alt={''}
            src={'/shared-assets/images/error-outline.png'}
            style={{ width: '48px', height: '48px' }}
          />
          <WarningText>
            {t('RemoveAcnsWarning', { acnsName: editAcns?.name || '' })}
          </WarningText>
          <IonRow
            class="ion-justify-content-between"
            style={{ width: '270px' }}
          >
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={() => removeAcns(editAcns.name)}
              >
                {t('Confirm')}
                {loading ? (
                  <IonSpinner style={{ marginLeft: '10px' }}></IonSpinner>
                ) : null}
              </PurpleButton>
            </IonCol>
            <IonCol>
              <WhiteButton
                expand="block"
                onClick={() => setIsConfirmModel(false)}
              >
                {t('Cancel')}
              </WhiteButton>
            </IonCol>
          </IonRow>
        </ModelDiv>
      </IonModal>
      <IonModal
        id="settings-model"
        isOpen={isResultModel}
        onDidDismiss={() => setIsResultModel(false)}
      >
        <ModelDiv>
          <SuccessfulIconWithTitle
            title={t('RemoveAcnsSuccess', { acnsName: editAcns?.name || '' })}
          />
          <PurpleButton expand="block" onClick={() => setIsResultModel(false)}>
            {t('Close')}
          </PurpleButton>
        </ModelDiv>
      </IonModal>
      <IonToast
        cssClass="settings-toast"
        isOpen={showEditToast}
        onDidDismiss={() => setShowEditToast(false)}
        message={t('EditAcnsSuccess') as string}
        duration={1500}
        icon={checkmarkCircleOutline}
      />
    </DashboardLayout>
  );
}
