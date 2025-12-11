import {
  type ICreateSecondaryOtk,
  type IEstimateNetworkFee,
  type IGetOwnerDepositKeyDto,
  type IGetOwnerDepositKeyResponse,
  type ILookForL2Address,
  type ILookForL2AddressResponse,
  type INetworkFeeValuesReturn,
  type IPrepareL1TxnResponse,
  type IPrepareL2Withdrawal,
  type IPrepareL2WithdrawalResponse,
  type IRetrieveIdentity,
  type IRetrieveIdentityResponse,
  type ISignedTransaction,
  type IWithdrawalProposal,
} from '@akashic/as-backend';

import { axiosBase } from './axios-helper';

const apiCall = async <T>(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  data?: unknown
): Promise<T> => {
  const response = await axiosBase.request<T>({ url, method, data });
  return response.data;
};

export const OwnersAPI = {
  findOrReserveKey: async (
    findKeyData: IGetOwnerDepositKeyDto
  ): Promise<IGetOwnerDepositKeyResponse> => {
    const url = `/key/deposit-key?identity=${findKeyData.identity}&coinSymbol=${findKeyData.coinSymbol}`;
    return await apiCall<IGetOwnerDepositKeyResponse>(url);
  },

  retrieveIdentity: async (
    retrieveData: IRetrieveIdentity
  ): Promise<IRetrieveIdentityResponse> => {
    const url = `/owner/retrieve-identity?publicKey=${retrieveData.publicKey}`;
    return await apiCall<IRetrieveIdentityResponse>(url);
  },

  lookForL2Address: async (
    l2Check: ILookForL2Address
  ): Promise<ILookForL2AddressResponse> => {
    let requestUrl = `/nft/look-for-l2-address?to=${l2Check.to}`;
    if (l2Check.coinSymbol) requestUrl += `&coinSymbol=${l2Check.coinSymbol}`;
    return await apiCall<ILookForL2AddressResponse>(requestUrl);
  },

  prepareL1Txn: async (
    transactionData: IWithdrawalProposal
  ): Promise<IPrepareL1TxnResponse> => {
    return await apiCall<IPrepareL1TxnResponse>(
      `/l1-txn-orchestrator/prepare-withdrawal`,
      'POST',
      JSON.stringify(transactionData)
    );
  },
  prepareL2Txn: async (
    transactionData: IPrepareL2Withdrawal
  ): Promise<IPrepareL2WithdrawalResponse> => {
    return await apiCall<IPrepareL2WithdrawalResponse>(
      `/l2-txn-orchestrator/prepare-l2-withdrawal`,
      'POST',
      JSON.stringify(transactionData)
    );
  },
  estimateNetworkFees: async (
    networkFeesData: IEstimateNetworkFee
  ): Promise<INetworkFeeValuesReturn> => {
    const queryParams = new URLSearchParams(
      Object.entries(networkFeesData).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();
    return await apiCall<INetworkFeeValuesReturn>(
      `/l1-txn-orchestrator/network-fees?${queryParams}`,
      'GET'
    );
  },

  generateSecondaryOtk: async (
    signedReq: ICreateSecondaryOtk
  ): Promise<void> => {
    await apiCall<void>(
      `/owner/generate-secondary-otk`,
      'POST',
      JSON.stringify(signedReq)
    );
  },

  updateTreasuryOtk: async (signedReq: ISignedTransaction): Promise<void> => {
    await apiCall<void>(
      `/owner/update-treasury-thresholds`,
      'POST',
      JSON.stringify(signedReq)
    );
  },

  removeTreasuryOtk: async (signedReq: ISignedTransaction): Promise<void> => {
    await apiCall<void>(
      `/owner/remove-treasury-key`,
      'POST',
      JSON.stringify(signedReq)
    );
  },

  becomeFxBp: async (signedReq: ICreateSecondaryOtk): Promise<void> => {
    await apiCall<void>(
      `/owner/become-fx-bp`,
      'POST',
      JSON.stringify(signedReq)
    );
  },
};
