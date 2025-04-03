import './send.scss';

import type { IBaseTransaction } from '@activeledger/sdk-bip39';
import { datadogRum } from '@datadog/browser-rum';
import styled from '@emotion/styled';
import type {
  IL1ClientSideOtkTransactionBase,
  ITerriTransaction,
  ITransactionProposal,
  ITransactionProposalClientSideOtk,
} from '@helium-pay/backend';
import {
  keyError,
  L2Regex,
  NetworkDictionary,
  TEST_TO_MAIN,
} from '@helium-pay/backend';
import { IonCol, IonImg, IonRow } from '@ionic/react';
import axios from 'axios';
import Big from 'big.js';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import {
  AlertBox,
  CustomAlert,
  errorAlertShell,
  formAlertResetState,
} from '../../components/common/alert/alert';
import { PurpleButton, WhiteButton } from '../../components/common/buttons';
import {
  StyledInput,
  StyledInputErrorPrompt,
} from '../../components/common/input/styled-input';
import {
  CacheOtkContext,
  useFocusCurrency,
  useTheme,
} from '../../components/providers/PreferenceProvider';
import { SUPPORTED_CURRENCIES_FOR_EXTENSION } from '../../constants/currencies';
import { urls } from '../../constants/urls';
import { historyGoBackOrReplace } from '../../routing/history';
import { akashicPayPath } from '../../routing/navigation-tabs';
import { themeType } from '../../theme/const';
import { OwnersAPI } from '../../utils/api';
import { useAggregatedBalances } from '../../utils/hooks/useAggregatedBalances';
import { useExchangeRates } from '../../utils/hooks/useExchangeRates';
import { useKeyMe } from '../../utils/hooks/useKeyMe';
import { useAccountStorage } from '../../utils/hooks/useLocalAccounts';
import { calculateInternalWithdrawalFee } from '../../utils/internal-fee';
import { displayLongText } from '../../utils/long-text';
import { signTxBody } from '../../utils/nitr0gen-api';
import { unpackRequestErrorMessage } from '../../utils/unpack-request-error-message';
import { SendMain } from './send-main';

const SendWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '12px',
});

export const Divider = styled.div({
  borderTop: '1px solid #D9D9D9',
  boxSizing: 'border-box',
  height: '2px',
  width: '100%',
});

const CurrencyWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 0,
  gap: '8px',
  width: '100%',
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
  width: '100%',
  gap: '8px',
  height: '28px',
});

const GasFreeMarker = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 16px',
  gap: '8px',
  width: '100%',
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
  width: '100%',
  height: '28px',
  borderRadius: '8px',
  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '16px',
  border: '1px solid #958E99',
  color: 'var(--ion-color-primary-10)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

const EqualsL2Box = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,

  gap: '8px',
  height: '40px',

  borderRadius: '8px',

  fontWeight: '400',
  fontSize: '10px',
  lineHeight: '16px',
  color: 'var(--ion-color-primary-10)',

  border: '1px solid #958e99',
});

export const Chain = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  gap: '8px',
  width: '100%',
  height: '32px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 700,
  color: '#FFFFFF',
});

// eslint-disable-next-line sonarjs/cognitive-complexity
export function SendTo() {
  const { t } = useTranslation();
  const aggregatedBalances = useAggregatedBalances();
  const { keys: userWallets } = useKeyMe();
  const [alert, setAlert] = useState(formAlertResetState);
  const [recipientAlertRequest, setRecipientAlertRequest] =
    useState(formAlertResetState);
  const [amountAlertRequest, setAmountAlertRequest] =
    useState(formAlertResetState);
  const { keys: exchangeRates } = useExchangeRates();
  const [currency] = useFocusCurrency();
  const [storedTheme] = useTheme();
  const history = useHistory();

  // Find specified currency or default to the first one
  const currentWalletMetadata =
    SUPPORTED_CURRENCIES_FOR_EXTENSION.lookup(currency);
  let tokenTypeMetadata;
  if (currency?.token)
    tokenTypeMetadata = SUPPORTED_CURRENCIES_FOR_EXTENSION.lookup({
      displayName: currency.displayName,
      chain: currency.chain,
    });
  const { chain, token } = currentWalletMetadata.walletCurrency;

  const availableBalance = aggregatedBalances.get(
    currentWalletMetadata.walletCurrency
  );

  const [internalFee, setInternalFee] = useState('0.0');

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

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const validateRecipientAddressWithBackend = (recipientAddress: string) => {
    // Reset pending
    clearTimeout(timeoutHandle);

    // Reset form
    setRawAddress(recipientAddress);
    setToAddress(undefined);
    setRecipientAlertRequest(formAlertResetState);
    setGasFree(false);
    if (!recipientAddress) return;

    if (recipientAddress === activeAccount?.identity) {
      setRecipientAlertRequest(errorAlertShell(t('NoSelfSend')));
      return;
    }
    if (
      !recipientAddress.match(NetworkDictionary[chain].regex.address) &&
      !recipientAddress.match(L2Regex)
    ) {
      // 1. Regex validation
      // 2a. If input address does not match standard form, lookup value in the ACNS
      setTimeoutHandle(
        setTimeout(async () => {
          setL1AddressWhenL2(undefined);

          const acnsResult = await OwnersAPI.checkL2AddressByAlias({
            to: recipientAddress,
          });

          if (acnsResult.l2Address) {
            setToAddress(acnsResult.l2Address);
            setGasFree(true);
          } else {
            setRecipientAlertRequest({
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

        const { l2Address } = await OwnersAPI.checkL2Address({
          to: recipientAddress,
          coinSymbol: chain,
        });

        if (l2Address) {
          // If l2 address exists
          setToAddress(l2Address);
          recipientAddress.match(NetworkDictionary[chain].regex.address) &&
            setL1AddressWhenL2(recipientAddress);
          setGasFree(true);
        } else if (L2Regex.exec(recipientAddress)) {
          // If matches L2 format, but none found, show error
          setRecipientAlertRequest(errorAlertShell(t('invalidL2Address')));
        } else {
          setL1AddressWhenL2(undefined);
          setToAddress(recipientAddress);
          setGasFree(false);
        }
      }, validateAddressWithBackendTimeout)
    );
  };

  const [amount, setAmount] = useState<string>('');
  const validateAmount = (value: string) => {
    if (Big(value).gt(Big(availableBalance ?? 0).sub(internalFee))) {
      setAmountAlertRequest(errorAlertShell(t('SavingsExceeded')));
      return false;
    } else {
      setAmountAlertRequest(formAlertResetState);
    }

    // If sending token on L1, check balances for native coin of the chain (for paying gas-fee)
    if (
      token !== undefined &&
      !gasFree &&
      !!toAddress &&
      Big(
        aggregatedBalances.get({
          displayName: NetworkDictionary[chain].nativeCoin.displayName,
          chain,
        }) ?? '0'
      ).lte('0')
    ) {
      setAmountAlertRequest({
        success: false,
        visible: true,
        message: t('showNativeCoinNeededMsg', {
          coinSymbol: chain,
        }),
      });
      return false;
    } else {
      setAmountAlertRequest(formAlertResetState);
    }
    return !(!value || value.charAt(0) === '-' || Big(value).lte(0));
  };

  const validateAddress = (value: string) => {
    return gasFree || !!value.match(NetworkDictionary[chain].regex.address);
  };

  // Calculate internal fee, which is only (currently) used for L2 (gasFree)
  useEffect(() => {
    if (gasFree && amount !== '') {
      setInternalFee(
        calculateInternalWithdrawalFee(
          amount ?? '0',
          exchangeRates,
          chain,
          token
        )
      );
    } else {
      setInternalFee('0.0');
    }
  }, [rawAddress, amount, chain, exchangeRates, token, gasFree]);

  const [loading, setLoading] = useState(false);
  const { activeAccount } = useAccountStorage();
  const { cacheOtk } = useContext(CacheOtkContext);

  // Send transaction to the backend for verification
  // eslint-disable-next-line sonarjs/cognitive-complexity
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

    const originalTxn: ITransactionProposal = {
      fromAddress: activeAccount?.identity,
      toAddress,
      amount,
      coinSymbol: chain,
      tokenSymbol: token ? token : undefined,
      forceL1: !gasFree,
      toL1Address: l1AddressWhenL2,
    };
    try {
      const response = await OwnersAPI.verifyTransactionUsingClientSideOtk(
        originalTxn
      );

      // reject the request if /verify returns multiple transfers
      // for L2: multiple transactions from the same Nitr0gen identity can always be combined into a single one, so it should be fine
      if (response.length > 1 && !gasFree) {
        setRecipientAlertRequest(errorAlertShell(t('GenericFailureMsg')));
        return;
      }

      const transaction: (
        | IL1ClientSideOtkTransactionBase
        | ITransactionProposalClientSideOtk
      )[] = [];

      // L2
      if (gasFree) {
        const signedTx = await signTxBody<IBaseTransaction>(
          response[0].txToSign!,
          cacheOtk!
        );
        const { txToSign: _, ...transactionDetails } = response[0];
        transaction.push({ ...transactionDetails, signedTx });
      } else {
        // L1
        for (const res of response) {
          const signedTx = await signTxBody<ITerriTransaction>(
            res.txToSign! as ITerriTransaction,
            cacheOtk!
          );
          const { txToSign: _, ...transactionDetails } = res;
          transaction.push({ ...transactionDetails, signedTx });
        }
      }

      const feesEstimate = Number(response[0].feesEstimate || '0');
      const balance = Number(
        aggregatedBalances.get({
          displayName: NetworkDictionary[chain].nativeCoin.displayName,
          chain,
        }) ?? '0'
      );
      // if user does not have enough balance to pay the estimated gas, can not go to next step
      if (balance < feesEstimate) {
        setAmountAlertRequest(
          errorAlertShell(
            t('insufficientBalance', {
              coinSymbol: chain,
            })
          )
        );
      } else {
        setRawAddress('');
        setAmount('');
        setToAddress(undefined);
        setGasFree(false);
        setL1AddressWhenL2(undefined);
        history.push({
          pathname: akashicPayPath(urls.sendConfirm),
          state: {
            sendConfirm: {
              fromAddress: response[0].fromAddress,
              currencyDisplayName: currency.displayName || '',
              transaction,
              gasFree,
            },
          },
        });
      }
    } catch (error) {
      datadogRum.addError(error);
      let message = t(unpackRequestErrorMessage(error));
      if (
        axios.isAxiosError(error) &&
        error?.response?.data?.message === keyError.nativeExceeded
      ) {
        message = t('insufficientBalance', {
          coinSymbol: chain,
        });
      }
      setAmountAlertRequest(errorAlertShell(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomAlert state={alert} />
      <SendMain>
        <IonRow>
          <IonCol>
            <CurrencyWrapper>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <IonImg
                  src={
                    storedTheme === themeType.DARK
                      ? currentWalletMetadata.darkCurrencyIcon
                      : currentWalletMetadata.currencyIcon
                  }
                  style={
                    tokenTypeMetadata
                      ? { height: '56px', width: '56px' }
                      : { width: '40px', height: '40px' }
                  }
                />
                {tokenTypeMetadata && (
                  <IonImg
                    src={
                      storedTheme === themeType.DARK
                        ? tokenTypeMetadata.darkCurrencyIcon
                        : tokenTypeMetadata.currencyIcon
                    }
                    style={{
                      height: '30px',
                      position: 'absolute',
                      top: 0,
                      left: 'calc(50% + 16px)',
                    }}
                  />
                )}
              </div>
              <BalanceText>
                {Big(
                  aggregatedBalances.get(
                    currentWalletMetadata.walletCurrency
                  ) ?? '0'
                ).toFixed(2)}{' '}
                <span className={'ion-text-size-md'}>
                  {currentWalletMetadata.walletCurrency.displayName}
                </span>
              </BalanceText>
            </CurrencyWrapper>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <SendWrapper>
              <StyledInput
                isHorizontal={true}
                label={t('Amount')}
                placeholder={t('EnterAmount')}
                type="number"
                errorPrompt={StyledInputErrorPrompt.Amount}
                onIonInput={({ target: { value } }) => {
                  setAmount(value as string);
                }}
                validate={validateAmount}
                submitOnEnter={verifyTransaction}
                value={amount}
              />
              <GasWrapper style={{ margin: '8px 0' }}>
                <StyledInput
                  isHorizontal={true}
                  label={t('SendTo')}
                  placeholder={t('EnterAddress')}
                  type={'text'}
                  errorPrompt={StyledInputErrorPrompt.Address}
                  onIonInput={({ target: { value } }) => {
                    validateRecipientAddressWithBackend(value as string);
                  }}
                  submitOnEnter={verifyTransaction}
                  value={rawAddress}
                />
                {!gasFree && toAddress && (
                  <IonImg
                    src={
                      !amountAlertRequest.message &&
                      !recipientAlertRequest.message &&
                      toAddress
                        ? '/shared-assets/images/right.png'
                        : storedTheme === themeType.LIGHT
                        ? '/shared-assets/images/right-light.svg'
                        : '/shared-assets/images/right-dark.svg'
                    }
                    style={{ width: '32px', height: '32px' }}
                  />
                )}
              </GasWrapper>
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
                    style={{ width: '32px', height: '32px' }}
                  />
                </GasWrapper>
              )}
              {gasFree || !toAddress ? (
                <Divider />
              ) : (
                <Chain
                  style={{
                    gap: '8px',
                    backgroundColor:
                      storedTheme === themeType.DARK ? '#C297FF' : '#290056',
                  }}
                >
                  <IonImg
                    src={NetworkDictionary[chain].networkIcon}
                    style={{ width: '20px', height: '26px' }}
                  />
                  {NetworkDictionary[currency.chain].displayName.replace(
                    /Chain/g,
                    ''
                  )}
                </Chain>
              )}
              <GasWrapper className={'ion-justify-content-between'}>
                {gasFree && (
                  <GasFreeMarker
                    style={{
                      background:
                        !toAddress && storedTheme === themeType.LIGHT
                          ? '#6750A41F'
                          : !toAddress && storedTheme === themeType.DARK
                          ? '#625B71'
                          : '#41CC9A',

                      color:
                        toAddress && storedTheme === themeType.LIGHT
                          ? '#FFFFFF'
                          : '',
                    }}
                  >
                    {t('GasFree')}
                  </GasFreeMarker>
                )}
                {gasFree || !toAddress ? null : (
                  <FeeMarker>{`${t('GasFee')} : - ${
                    TEST_TO_MAIN.get(chain) || chain
                  }`}</FeeMarker>
                )}
                <FeeMarker>{`${t('Fee')}: ${internalFee} ${
                  token || TEST_TO_MAIN.get(chain) || chain
                }`}</FeeMarker>
              </GasWrapper>
              {amountAlertRequest.visible && (
                <AlertBox state={amountAlertRequest} />
              )}
              {recipientAlertRequest.visible && (
                <AlertBox state={recipientAlertRequest} />
              )}
              <IonRow style={{ width: '100%' }}>
                <IonCol size="6" style={{ paddingLeft: '0' }}>
                  <PurpleButton
                    style={{ width: '100%', marginLeft: '0' }}
                    expand="block"
                    onClick={verifyTransaction}
                    disabled={
                      loading ||
                      !toAddress ||
                      amountAlertRequest.visible ||
                      recipientAlertRequest.visible
                    }
                    isLoading={loading}
                  >
                    {t('Send')}
                  </PurpleButton>
                </IonCol>
                <IonCol size="6" style={{ paddingRight: '0' }}>
                  <WhiteButton
                    style={{ width: '100%', marginRight: '0' }}
                    expand="block"
                    disabled={loading}
                    onClick={() => historyGoBackOrReplace()}
                  >
                    {t('Cancel')}
                  </WhiteButton>
                </IonCol>
              </IonRow>
            </SendWrapper>
          </IonCol>
        </IonRow>
      </SendMain>
    </>
  );
}
