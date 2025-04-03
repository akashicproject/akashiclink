import styled from '@emotion/styled';
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import { useState } from 'react';

import { PurpleButton, WhiteButton } from '../components/buttons';
import { LoggedLayout } from '../components/layout/logged-layout';
import { availableNames, K } from '../constants/dummy-data';

const enum View {
  edit = 'edit',
  list = 'list',
}

const MenuSlider = styled(IonLabel)({
  fontWeight: 700,
  fontSize: '16px',
  fontFamily: 'Nunito Sans',
  lineHeight: '24px',
  textAlign: 'center',
  align: 'center',
  textTransform: 'none',
  color: 'var(--ion-color-dark)',
});

export function SettingsNaming() {
  // const query = new URLSearchParams(window.location.search);

  const [view, setView] = useState(View.list);
  const [keyNames, setKeyNames] = useState<{ [key: string]: string }>({});
  const [editKey, setEditKey] = useState<K>();
  const [name, setName] = useState('');

  return (
    <LoggedLayout>
      <IonRow style={{ marginBottom: '50px' }}>
        <IonCol size="12">
          <IonSegment
            value={view}
            onIonChange={({ detail: { value } }) => setView(value as View)}
          >
            <IonSegmentButton style={{ minWidth: '50%' }} value={View.edit}>
              <MenuSlider>New (Edit)</MenuSlider>
            </IonSegmentButton>
            <IonSegmentButton style={{ minWidth: '50%' }} value={View.list}>
              <MenuSlider>List</MenuSlider>
            </IonSegmentButton>
          </IonSegment>
        </IonCol>
      </IonRow>
      {view === View.list && (
        <>
          {Object.values(K).map((k) => (
            <IonRow key={k} style={{ width: '50%', margin: '0 auto' }}>
              <IonCol
                style={{
                  borderRadius: '10px 0 0 10px',
                  border: '1px solid gray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MenuSlider>{keyNames[k] || 'Not set'}</MenuSlider>
              </IonCol>
              <IonCol
                style={{
                  borderRadius: '0',
                  border: '1px solid gray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MenuSlider>{k}</MenuSlider>
              </IonCol>
              <IonCol
                size="1"
                style={{
                  background: 'var(--ion-color-secondary)',
                  borderRadius: '0 10px 10px 0',
                  border: '1px solid gray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IonButton
                  class="icon-button-icon"
                  fill="clear"
                  onClick={() => {
                    setEditKey(k);
                    setView(View.edit);
                  }}
                >
                  <IonIcon slot="icon-only" color="dark" icon={createOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          ))}
        </>
      )}
      {editKey && view === View.edit && (
        <IonGrid style={{ width: '50%' }}>
          <IonRow>
            <IonCol>
              <IonSelect
                style={{
                  border: '1px solid gray',
                  borderRadius: '10px',
                  padding: '5px 10px',
                }}
                value={name}
                interface="popover"
                placeholder="Available names"
                onIonChange={({ detail: { value } }) => setName(value)}
              >
                {availableNames
                  .filter((n) => !Object.values(keyNames).includes(n))
                  .map((a) => (
                    <IonSelectOption key={a} value={a}>
                      {a}
                    </IonSelectOption>
                  ))}
              </IonSelect>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol class="ion-center">
              <IonLabel
                style={{
                  width: '100%',
                  border: '1px solid gray',
                  borderRadius: '10px',
                  padding: '5px 10px',
                }}
              >
                {editKey}
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={() => {
                  setKeyNames({
                    ...keyNames,
                    [editKey]: name,
                  });
                  setView(View.list);
                }}
              >
                Confirm
              </PurpleButton>
            </IonCol>
            <IonCol>
              <WhiteButton
                expand="block"
                onClick={() => {
                  setView(View.list);
                }}
              >
                Cancel
              </WhiteButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </LoggedLayout>
  );
}
