import './settings.css';

import styled from '@emotion/styled';
import type { IAcnsResponse } from '@helium-pay/backend';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonLabel,
  IonModal,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import {
  checkmarkCircleOutline,
  pencilOutline,
  trashBinOutline,
} from 'ionicons/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  errorAlertShell,
  formAlertResetState,
} from '../components/alert/alert';
import { PurpleButton, WhiteButton } from '../components/buttons';
import { HomeButton } from '../components/home-button';
import { LoggedLayout } from '../components/layout/logged-layout';
import { StyledInput } from '../components/styled-input';
import { OwnersAPI } from '../utils/api';
import { useNftAcnsMe } from '../utils/hooks/useNftAcnsMe';
import { displayLongText } from '../utils/long-text';
import { unpackRequestErrorMessage } from '../utils/unpack-request-error-message';

const enum View {
  edit = 'edit',
  list = 'list',
}

const MenuSlider = styled(IonLabel)({
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  align: 'center',
  textTransform: 'none',
  color: 'var(--ion-color-dark)',
});

const AcnsWrapper = styled.div({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: '24px',
});

const OneAcns = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const OneAcnsWrapper = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '-1px',
});

const AcnsName = styled.div({
  display: 'flex',
  width: '117px',
  height: '40px',
  padding: '6px 6px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px 0px 0px 8px',
  border: '1px solid var(--m-3-sys-dark-outline, #958E99)',
  fontSize: '14px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

const AcnsAddress = styled.div({
  display: 'flex',
  width: '128px',
  height: '40px',
  padding: '6px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid var(--m-3-sys-dark-outline, #958E99)',
  fontSize: '14px',
  fontFamily: 'Nunito Sans',
  fontWeight: '700',
  lineHeight: '20px',
  color: 'var(--ion-color-primary-10)',
});

const EditBox = styled.div({
  display: 'flex',
  width: '40px',
  height: '40px',
  padding: '6px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid var(--m-3-sys-dark-outline, #958E99)',
  '&:hover': {
    backgroundColor: '#EDDCFF',
  },
});

const DeleteBox = styled.div({
  display: 'flex',
  width: '40px',
  height: '40px',
  padding: '6px 16px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '0px 8px 8px 0px',
  border: '1px solid var(--m-3-sys-dark-outline, #958E99)',
  '&:hover': {
    backgroundColor: '#EDDCFF',
  },
});

const Divider = styled.div({
  width: '100%',
  height: '2px',
  border: '1px solid #D9D9D9',
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

  const { acns, mutate } = useNftAcnsMe();
  const namedAcns = acns.filter((a) => !!a.value);
  const [view, setView] = useState(View.list);
  const [alert, setAlert] = useState(formAlertResetState);
  const [editAcns, setEditAcns] = useState(namedAcns[0]);
  const [selectedName, setSelectedName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showEditToast, setShowEditToast] = useState(false);
  const [isConfirmModel, setIsConfirmModel] = useState(false);
  const [isResultModel, setIsResultModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeAcns = async (name: string) => {
    await mutate(async () => {
      setLoading(true);
      try {
        await OwnersAPI.updateAcns({
          name: name,
          newValue: null,
        });
        setIsConfirmModel(false);
        setIsResultModel(true);
      } catch (error) {
        setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
      } finally {
        setLoading(false);
      }
    });
  };

  const confirmUpdate = async () => {
    await mutate(async () => {
      setLoading(true);
      try {
        await OwnersAPI.updateAcns({
          name: selectedName,
          newValue: newValue,
        });
        setView(View.list);
        setShowEditToast(true);
      } catch (error) {
        setAlert(errorAlertShell(t(unpackRequestErrorMessage(error))));
      } finally {
        setLoading(false);
      }
    });
  };

  const updateAcns = (acns: IAcnsResponse) => {
    setEditAcns(acns);
    setSelectedName(acns.name);
    setView(View.edit);
  };

  return (
    <LoggedLayout>
      <Divider style={{ margin: '20px 0px 0px' }} />
      <Alert state={alert} />
      <IonRow style={{ marginBottom: '30px' }}>
        <IonCol size="12">
          <IonSegment
            value={view}
            class="settings-segment"
            onIonChange={({ detail: { value } }) => setView(value as View)}
          >
            <IonSegmentButton
              style={{ minWidth: '50%' }}
              value={View.list}
              class="settings-segment-button"
            >
              <MenuSlider>{t('List')}</MenuSlider>
            </IonSegmentButton>
            <IonSegmentButton
              style={{ minWidth: '50%' }}
              value={View.edit}
              class="settings-segment-button"
            >
              <MenuSlider>{t('NewEdit')}</MenuSlider>
            </IonSegmentButton>
          </IonSegment>
        </IonCol>
      </IonRow>
      <IonGrid>
        {view === View.list &&
          (namedAcns.length > 0 ? (
            <IonRow style={{ marginTop: '30px' }}>
              <IonCol class="ion-center">
                <AcnsWrapper>
                  {acns.map((oneAcns, index) => (
                    <OneAcns key={oneAcns.name}>
                      <OneAcnsWrapper>
                        <AcnsName>{oneAcns.name}</AcnsName>
                        <AcnsAddress>
                          {oneAcns.value
                            ? displayLongText(oneAcns.value)
                            : 'N/A'}
                        </AcnsAddress>
                        <EditBox>
                          <IonButton
                            class="acns-icon"
                            onClick={() => updateAcns(oneAcns)}
                          >
                            <IonIcon
                              slot="icon-only"
                              icon={pencilOutline}
                            ></IonIcon>
                          </IonButton>
                        </EditBox>
                        <DeleteBox>
                          <IonButton
                            class="acns-icon"
                            onClick={() => {
                              setEditAcns(oneAcns);
                              setIsConfirmModel(true);
                            }}
                            disabled={!oneAcns.value}
                          >
                            <IonIcon
                              slot="icon-only"
                              icon={trashBinOutline}
                            ></IonIcon>
                          </IonButton>
                        </DeleteBox>
                      </OneAcnsWrapper>
                      {index === acns.length - 1 ? null : <Divider />}
                    </OneAcns>
                  ))}
                </AcnsWrapper>
              </IonCol>
            </IonRow>
          ) : (
            <IonRow>
              <IonCol>
                <NoDataDiv>{t('NoData')}</NoDataDiv>
              </IonCol>
            </IonRow>
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
            <IonRow style={{ marginTop: '20px' }}>
              <IonCol>
                <StyledInput
                  placeholder={'x'}
                  onIonInput={({ target: { value } }) => {
                    setNewValue(value as string);
                  }}
                  style={{ width: '100%' }}
                />
              </IonCol>
            </IonRow>
            <IonRow style={{ marginTop: '20px' }}>
              <IonCol>
                <PurpleButton
                  expand="block"
                  onClick={() => confirmUpdate()}
                  disabled={loading}
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
      </IonGrid>
      <IonRow
        class="ion-justify-content-center"
        style={{
          marginTop: '20px',
          position: 'relative',
          bottom: '20px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <HomeButton />
      </IonRow>
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
          <IonImg
            alt={''}
            src={'/shared-assets/images/right.png'}
            style={{ width: '48px', height: '48px' }}
          />
          <WarningText>
            {t('RemoveAcnsSuccess', { acnsName: editAcns?.name || '' })}
          </WarningText>
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
    </LoggedLayout>
  );
}
