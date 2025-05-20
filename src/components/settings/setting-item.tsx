import { Browser } from '@capacitor/browser';
import styled from '@emotion/styled';
import { IonIcon, IonItem, IonLabel, IonText, isPlatform } from '@ionic/react';
import type { CSSProperties, FC, ReactNode } from 'react';
import { useState } from 'react';

import { LINK_TYPE, useI18nInfoUrls } from '../../i18n/links';
import { Divider } from '../common/divider';
import { ForwardArrow } from './forward-arrow';

const Header = styled(IonText)`
  font-size: 1rem;
  color: var(--ion-color-primary-10);
  line-height: 20px;
  font-weight: 700;
`;
const SubHeader = styled(IonText)`
  font-size: 0.75rem;
  color: #b0a9b3;
  line-height: 20px;
  font-weight: 700;
`;
const StyledIonItem = styled(IonItem)<{ backgroundColor?: string }>`
  width: 100%;
  --min-height: 36px;
  --inner-border-width: 0px;
  --inner-padding-end: 8px;
  --inner-padding-start: 8px;
  --background-hover: var(--ion-current-selection);
  --background-hover-opacity: var(--ion-current-selection-opacity);
  --border-radius: 8px;
  --background: ${(props) =>
    props.backgroundColor ? props.backgroundColor : ''};
  cursor: pointer;
`;

export type SettingItemProps = {
  header: string;
  icon?: string;
  onClick?: () => void;
  isAccordion?: boolean;
  children?: ReactNode;
  EndComponent?: FC<{ showAccordionItem?: boolean }>;
  isDivider?: boolean;
  backgroundColor?: string;
  subHeading?: string;
  ripple?: boolean;
  link?: string;
  headerStyle?: CSSProperties;
  iconStyle?: CSSProperties;
};

export function SettingItem({
  icon,
  header,
  isAccordion = false,
  EndComponent,
  children,
  isDivider,
  onClick,
  backgroundColor,
  subHeading,
  ripple = true,
  link,
  headerStyle,
  iconStyle,
}: SettingItemProps) {
  const [showAccordionItem, setShowAccordionItem] = useState(false);
  const infoUrls = useI18nInfoUrls();

  const handleClick = async () => {
    if (link) {
      const isMobile = isPlatform('ios') || isPlatform('android');

      if (isMobile) {
        await Browser.open({ url: infoUrls[LINK_TYPE.InfoSite] });
      } else {
        window.location.href = `mailto:${link}`;
      }
    } else if (!isAccordion && onClick) {
      onClick();
    } else if (isAccordion) {
      setShowAccordionItem(!showAccordionItem);
    }
  };
  return (
    <>
      <StyledIonItem
        backgroundColor={backgroundColor}
        button={ripple}
        detail={false}
        className="ion-no-padding"
        onClick={handleClick}
      >
        <IonIcon
          className="ion-no-margin ion-margin-left-xxs"
          slot="start"
          size="24px"
          src={icon ?? ''}
          style={{
            visibility: icon ? 'visible' : 'hidden',
            ...iconStyle,
          }}
        />
        <IonLabel className="ion-no-margin ion-display-flex ion-flex-direction-column">
          <Header style={headerStyle}>{header}</Header>
          {subHeading && <SubHeader>{subHeading}</SubHeader>}
        </IonLabel>
        {EndComponent ? (
          <EndComponent showAccordionItem={showAccordionItem} />
        ) : (
          <ForwardArrow />
        )}
      </StyledIonItem>
      {isAccordion && showAccordionItem && children}
      {isDivider && <Divider />}
    </>
  );
}
