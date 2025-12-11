import {
  type IWalletScreeningData,
  type RiskDescription,
  RiskLevel,
} from '@akashic/as-backend';
import { IonText } from '@ionic/react';
import { type ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../redux/app/hooks';
import { selectTheme } from '../../redux/slices/preferenceSlice';

const SUSPICIOUS_CATEGORIES: RiskDescription[] = [
  'Malicious Address',
  'Suspected Malicious Address',
  'Interact With Malicious Address',
  'Interact With Suspected Malicious Address',
];

const RISK_CATEGORIES: RiskDescription[] = [
  'High-risk Tag Address',
  'Medium-risk Tag Address',
  'Mixer',
  'Sanctioned Entity',
  'Risk Exchange',
  'Gambling',
  'Involved Theft Activity',
  'Involved Ransom Activity',
  'Involved Phishing Activity',
  'Interact With Malicious Address',
  'Interact With High-risk Tag Address',
  'Interact With Medium-risk Tag Addresses',
];

export const RiskGraph = ({
  riskLevel,
  detailList,
  hackingEvent,
}: {
  riskLevel: RiskLevel;
  detailList: RiskDescription[];
  hackingEvent: IWalletScreeningData['hackingEvent'];
}) => {
  const { t } = useTranslation();
  const storedTheme = useAppSelector(selectTheme);

  const RISK_COLORS = {
    [RiskLevel.LOW]: {
      stroke: '#0C7368',
      fill: '#EBFFFC',
    },
    [RiskLevel.MODERATE]: {
      stroke: '#0D97EB',
      fill: '#E8F1FF',
    },
    [RiskLevel.HIGH]: {
      stroke: '#DB7C22',
      fill: storedTheme === 'dark' ? '#DB7C22' : '#FFF1DB',
    },
    [RiskLevel.SEVERE]: {
      stroke: '#FF1C41',
      fill: '#FF1C41',
    },
  };

  const RISK_NUMBERS = {
    [RiskLevel.LOW]: 20,
    [RiskLevel.MODERATE]: 40,
    [RiskLevel.HIGH]: 60,
    [RiskLevel.SEVERE]: 80,
  };

  // Start the graph at 20 (the first step)
  // then based on the type of "risk" in detailList update the different axes of the graph
  let graphSeries = [20, 20, 20];

  if (hackingEvent !== '') graphSeries[2] = RISK_NUMBERS[riskLevel];

  if (detailList.some((detail) => SUSPICIOUS_CATEGORIES.includes(detail))) {
    graphSeries[1] = RISK_NUMBERS[riskLevel];
  }

  if (detailList.some((detail) => RISK_CATEGORIES.includes(detail))) {
    graphSeries[0] = RISK_NUMBERS[riskLevel];
  }

  const options: ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      max: 80,
      tickAmount: 4,
    },
    // Styling of the spokes
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: storedTheme === 'dark' ? '#47464A' : '#E2E1E8',
          fill: {
            colors:
              storedTheme === 'dark'
                ? ['#09003E', '#060030']
                : ['#f8f8f8', '#fff'],
          },
          connectorColors: '#B2B1B8',
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    markers: {
      size: 2,
      hover: {
        size: 6,
      },
      colors: [RISK_COLORS[riskLevel].stroke],
      strokeWidth: 0,
    },
    stroke: {
      show: true,
      width: 1,
      colors: [RISK_COLORS[riskLevel].stroke],
    },
    fill: {
      opacity: 0.6,
      colors: [RISK_COLORS[riskLevel].fill],
    },
  };

  const series = [
    {
      data: graphSeries,
    },
  ];

  return (
    <div
      style={{
        width: 180,
        height: 180,
        display: 'flex',
        margin: 'auto',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="radar"
        height={180}
      />
      <IonText
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%) translateY(20px)',
          margin: 0,
          fontSize: '12px',
          color: 'var(--ion-color-on-surface-light)',
        }}
      >
        {t('RiskEntity')}
      </IonText>
      <IonText
        style={{
          position: 'absolute',
          bottom: '0',
          left: '80%',
          transform: 'translateX(-50%) translateY(-20px)',
          margin: 0,
          fontSize: '12px',
          whiteSpace: 'nowrap',
          color: 'var(--ion-color-on-surface-light)',
        }}
      >
        {t('SuspiciousTxn')}
      </IonText>
      <IonText
        style={{
          position: 'absolute',
          bottom: '0',
          left: '20%',
          transform: 'translateX(-50%) translateY(-20px)',
          margin: 0,
          fontSize: '12px',
          color: 'var(--ion-color-on-surface-light)',
        }}
      >
        {t('HackingEvent')}
      </IonText>
    </div>
  );
};
