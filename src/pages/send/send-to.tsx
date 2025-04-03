import './send.css';

import styled from '@emotion/styled';
import {
  type ITransactionVerifyResponse as VerifiedTransaction,
  NetworkDictionary,
  TEST_TO_MAIN,
} from '@helium-pay/backend';
import { L2Regex } from '@helium-pay/owners/src/constants/currencies';
import { IonCol, IonImg, IonRow, IonSpinner, useIonRouter } from '@ionic/react';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  AlertBox,
  errorAlertShell,
  formAlertResetState,
} from '../../components/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/styled-input';
import { errorMsgs } from '../../constants/error-messages';
import { urls } from '../../constants/urls';
import { akashicPayPath } from '../../routing/navigation-tree';
import { OwnersAPI } from '../../utils/api';
import { useAggregatedBalances } from '../../utils/hooks/useAggregatedBalances';
import { useExchangeRates } from '../../utils/hooks/useExchangeRates';
import { useKeyMe } from '../../utils/hooks/useKeyMe';
import { useLocalStorage } from '../../utils/hooks/useLocalStorage';
import { calculateInternalFee } from '../../utils/internal-fee';
import { lastPageStorage } from '../../utils/last-page-storage';
import { displayLongText } from '../../utils/long-text';
import { WALLET_CURRENCIES } from '../../utils/supported-currencies';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { SendConfirm } from './send-confirm';
import { SendMain } from './send-main';
import { SendResult } from './send-result';

/** Styled components */
const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  width: '270px',
});

const Divider = styled.div({
  borderTop: '1px solid #D9D9D9',
  boxSizing: 'border-box',
  height: '2px',
  width: '270px',
});

const CurrencyWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  width: '100%',
  height: '76px',
});

const BalanceText = styled.div({
  fontStyle: 'normal',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '28px',
  color: 'var(--ion-color-primary-10)',
  textAlign: 'center',
});

const GasWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0',
  gap: '16px',
  width: '270px',
  height: '28px',
});

const GasFreeMarker = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '127px',
  height: '28px',
  borderRadius: '8px',
  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '16px',
});

const FeeMarker = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '127px',
  height: '28px',
  borderRadius: '8px',
  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '16px',
  border: '1px solid #958E99',
  color: 'var(--ion-color-primary-10)',
});

const EqualsL2Box = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  gap: '8px',
  width: '270px',
  height: '40px',

  borderRadius: '8px',

  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '16px',
  color: 'var(--ion-color-primary-10)',

  border: '1px solid #958e99',
});

/** Corresponds to steps taken by user as they make a withdrawal */
enum SendView {
  Send = 'Send',
  Confirm = 'Confirm',
  Result = 'Result',
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function SendTo() {
  const { t } = useTranslation();
  const router = useIonRouter();
  const aggregatedBalances = useAggregatedBalances();
  const { keys: userWallets } = useKeyMe();
  const [alert, setAlert] = useState(formAlertResetState);
  const [alertRequest, setAlertRequest] = useState(formAlertResetState);
  const { keys: exchangeRates } = useExchangeRates();

  const [_, __, currency] = useLocalStorage(
    'currency',
    WALLET_CURRENCIES[0].symbol
  );

  // store current page to main logged page if reopen
  useEffect(() => {
    lastPageStorage.store(urls.sendTo);
  }, []);

  // Find specified currency or default to the first one
  const currentWalletCurrency =
    WALLET_CURRENCIES.find((c) => c.symbol === currency) ||
    WALLET_CURRENCIES[0];

  const currentWallet = userWallets.filter((wallet) => {
    return wallet.coinSymbol === currentWalletCurrency.currency[0];
  })[0];
  const coinSymbol = currentWalletCurrency.currency[0];
  const tokenSymbol = currentWalletCurrency.currency[1];

  const [internalFee, setInternalFee] = useState(
    calculateInternalFee('1', exchangeRates, coinSymbol, tokenSymbol)
  );

  // Keeps track of which page the user is at
  const [pageView, setPageView] = useState(SendView.Send);

  const [verifiedTransaction, setVerifiedTransaction] =
    useState<VerifiedTransaction[]>();

  /**
   * Handling of direct l1 transfers or gas-free l2 transfers via nitr0gen
   */
  const [toAddress, setToAddress] = useState<string>();
  const [rawAddress, setRawAddress] = useState('');
  const [l1AddressWhenL2, setL1AddressWhenL2] = useState<string>();
  const [gasFree, setGasFree] = useState(false);

  /**
   * Timeout to avoid spamming of backend with address checks
   */
  const validateAddressWithBackendTimeout = 500;
  const [timeoutHandle, setTimeoutHandle] =
    useState<ReturnType<typeof setTimeout>>();

  const validateRecipientAddressWithBackend = (recipientAddress: string) => {
    // Reset pending
    clearTimeout(timeoutHandle);

    // Reset form
    setRawAddress(recipientAddress);
    setToAddress(undefined);
    setAlertRequest(formAlertResetState);
    setGasFree(false);
    if (!recipientAddress) return;

    // 1. Regex validation
    if (
      !recipientAddress.match(
        NetworkDictionary[currentWalletCurrency.currency[0]].regex.address
      ) &&
      !recipientAddress.match(L2Regex)
    ) {
      // 2a. If input address does not match standard form, lookup value in the ACNS
      setTimeoutHandle(
        setTimeout(async () => {
          setL1AddressWhenL2(undefined);

          const acnsResult = await OwnersAPI.nftSearch({
            searchValue: recipientAddress,
          });

          if (acnsResult.value) {
            setToAddress(acnsResult.value);
            setGasFree(true);
          } else {
            setAlertRequest({
              success: false,
              visible: true,
              message: t('AddressHelpText'),
            });
          }
        }, validateAddressWithBackendTimeout)
      );
      return;
    }

    // 2b. Check with backend if there is a l2 that can fulfill this request
    setTimeoutHandle(
      setTimeout(async () => {
        setL1AddressWhenL2(undefined);

        const l2address = await OwnersAPI.checkL2Address({
          to: recipientAddress,
          coinSymbol: currentWalletCurrency.currency[0],
        });

        if (l2address) {
          // If l2 address exists
          setToAddress(l2address);
          recipientAddress.match(
            NetworkDictionary[currentWalletCurrency.currency[0]].regex.address
          ) && setL1AddressWhenL2(recipientAddress);
          setGasFree(true);
        } else {
          setL1AddressWhenL2(undefined);
          setToAddress(recipientAddress);
          if (tokenSymbol !== undefined)
            setAlertRequest({
              success: false,
              visible: true,
              message: t('showNativeCoinNeededMsg', {
                coinSymbol: currentWalletCurrency.currency[0],
              }),
            });
          setGasFree(false);
        }
      }, validateAddressWithBackendTimeout)
    );
  };

  const [amount, setAmount] = useState<string>('');
  const validateAmount = (value: string) =>
    !(!value || value.charAt(0) === '-' || Big(value).lte(0));
  const validateAddress = (value: string) => {
    return (
      gasFree ||
      !!value.match(
        NetworkDictionary[currentWalletCurrency.currency[0]].regex.address
      )
    );
  };

  const [signError, setSignError] = useState(errorMsgs.NoError);
  const [loading, setLoading] = useState(false);

  // Send transaction to the backend for verification
  const verifyTransaction = async () => {
    if (!toAddress || !validateAddress(toAddress)) {
      setAlert(errorAlertShell(t('AddressHelpText')));
      return;
    }
    if (!validateAmount(amount)) {
      setAlert(errorAlertShell(t('AmountHelpText')));
      return;
    }

    setLoading(true);

    const originalTxn = {
      fromAddress: currentWallet.address,
      toAddress,
      amount,
      coinSymbol,
      tokenSymbol: tokenSymbol ? tokenSymbol : undefined,
      forceL1: !gasFree,
      toL1Address: l1AddressWhenL2,
    };
    try {
      const response = await OwnersAPI.verifyTransaction(originalTxn);
      // reject the request if /verify returns multiple transfers
      // for L2: multiple transactions from the same Nitr0gen identity can always be combined into a single one, so it should be fine
      if (response.length > 1 && !gasFree) {
        setAlertRequest(errorAlertShell(t('GenericFailureMsg')));
        return;
      }
      setVerifiedTransaction(response);
      const feesEstimate = Number(response[0].feesEstimate || '0');
      const balance = Number(currentWallet.balance);
      // if user does not have enough balance to pay the estimated gas, can not go to next step
      if (balance < feesEstimate) {
        setAlertRequest(
          errorAlertShell(
            t('insufficientBalance', {
              coinSymbol,
            })
          )
        );
      } else {
        setPageView(SendView.Confirm);
      }
    } catch (error) {
      setAlertRequest(errorAlertShell(t(unpackRequestErrorMessage(error))));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Alert state={alert} />
      {pageView === SendView.Send && (
        <SendMain>
          <IonRow style={{ marginTop: '36px' }}>
            <IonCol class="ion-center">
              <CurrencyWrapper>
                <IonImg
                  alt={''}
                  src={currentWalletCurrency.logo}
                  style={{ width: '40px', height: '40px' }}
                />
                <BalanceText>
                  {aggregatedBalances.get(currentWalletCurrency.currency)}{' '}
                  {currentWalletCurrency.symbol}
                </BalanceText>
              </CurrencyWrapper>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '28px' }}>
            <IonCol class="ion-center">
              <SendWrapper>
                <StyledInput
                  isHorizontal={true}
                  label={t('SendTo')}
                  placeholder={t('EnterAddress')}
                  type={'text'}
                  errorPrompt={StyledInputErrorPrompt.Address}
                  onIonInput={({ target: { value } }) =>
                    validateRecipientAddressWithBackend(value as string)
                  }
                  submitOnEnter={verifyTransaction}
                />
                <StyledInput
                  isHorizontal={true}
                  label={t('Amount')}
                  placeholder={t('EnterAmount')}
                  type="number"
                  errorPrompt={StyledInputErrorPrompt.Amount}
                  onIonInput={({ target: { value } }) => {
                    setAmount(value as string);
                    setInternalFee(
                      calculateInternalFee(
                        value as string,
                        exchangeRates,
                        coinSymbol,
                        tokenSymbol
                      )
                    );
                  }}
                  validate={validateAmount}
                  submitOnEnter={verifyTransaction}
                />
                {gasFree && (
                  <GasWrapper style={{ margin: '8px 0' }}>
                    <EqualsL2Box>
                      {l1AddressWhenL2
                        ? `${displayLongText(rawAddress)} = ${displayLongText(
                            toAddress
                          )}`
                        : `${displayLongText(toAddress, 30)}`}
                    </EqualsL2Box>
                    <IonImg
                      alt={''}
                      src={'/shared-assets/images/right.png'}
                      style={{ width: '40px', height: '40px' }}
                    />
                  </GasWrapper>
                )}
                <Divider />
                <GasWrapper>
                  <GasFreeMarker
                    style={{
                      background: !toAddress
                        ? 'rgba(103, 80, 164, 0.12)'
                        : gasFree
                        ? '#41CC9A'
                        : '#DE3730',
                      color: !toAddress ? '#2B0053' : '#FFFFFF',
                    }}
                  >
                    {t('GasFree')}
                  </GasFreeMarker>
                  <FeeMarker>{`Fee: ${internalFee.toFixed(2)} ${
                    TEST_TO_MAIN.get(coinSymbol) || coinSymbol
                  }`}</FeeMarker>
                </GasWrapper>
                {gasFree || !toAddress ? null : (
                  <GasWrapper>
                    <FeeMarker>{t('Layer1Transaction')}</FeeMarker>
                    <FeeMarker>{`+ ${t('GasFee')}`}</FeeMarker>
                  </GasWrapper>
                )}
                {alertRequest.visible && <AlertBox state={alertRequest} />}
              </SendWrapper>
            </IonCol>
          </IonRow>
          <IonRow
            class="ion-justify-content-between"
            style={{ padding: '20px 40px' }}
          >
            <IonCol>
              <PurpleButton
                expand="block"
                onClick={verifyTransaction}
                disabled={loading || !toAddress}
              >
                {t('Send')}
                {loading ? (
                  <IonSpinner style={{ marginLeft: '10px' }}></IonSpinner>
                ) : null}
              </PurpleButton>
            </IonCol>
            <IonCol>
              <WhiteButton
                expand="block"
                routerLink={akashicPayPath(urls.loggedFunction)}
              >
                {t('Cancel')}
              </WhiteButton>
            </IonCol>
          </IonRow>
        </SendMain>
      )}
      {pageView === SendView.Confirm && (
        <SendConfirm
          coinSymbol={currency || ''}
          transaction={verifiedTransaction}
          gasFree={gasFree}
          isResult={() => setPageView(SendView.Result)}
          getErrorMsg={(errorMsg) => setSignError(errorMsg)}
        />
      )}
      {pageView === SendView.Result && (
        <SendResult
          errorMsg={signError}
          transaction={verifiedTransaction}
          coinSymbol={currency || ''}
          goBack={() => router.goBack()}
        />
      )}
    </>
  );
}
