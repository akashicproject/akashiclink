import type {
  IEstimateGasFee,
  IEstimateGasFeeResponse,
  ILoginUserWithOtk,
  ILookForL2Address,
  ILookForL2AddressResponse,
  IMinimalUserResponse,
  IPrepareL1TxnResponse,
  IRetrieveIdentity,
  IRetrieveIdentityResponse,
  ITransactionProposal,
} from '@helium-pay/backend';

import { axiosBase, axiosBaseV1 } from './axios-helper';

export const OwnersAPI = {
  retrieveIdentity: async (
    retrieveData: IRetrieveIdentity
  ): Promise<IRetrieveIdentityResponse> => {
    const response = await axiosBase.get(
      `/public-api/owner/retrieve-identity?publicKey=${retrieveData.publicKey}`
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  loginV1: async (
    loginData: ILoginUserWithOtk
  ): Promise<IMinimalUserResponse> => {
    const response = await axiosBaseV1.post(
      `/auth/login`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  lookForL2Address: async (
    l2Check: ILookForL2Address
  ): Promise<ILookForL2AddressResponse> => {
    let requestUrl = `/nft/look-for-l2-address?to=${l2Check.to}`;
    if (l2Check.coinSymbol) requestUrl += `&coinSymbol=${l2Check.coinSymbol}`;
    const response = await axiosBase.get(requestUrl);
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  estimateGasFee: async (
    transactionData: IEstimateGasFee
  ): Promise<IEstimateGasFeeResponse> => {
    const response = await axiosBase.post(
      `/key/estimate-gas-fee`,
      JSON.stringify(transactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  prepareL1Txn: async (
    transactionData: ITransactionProposal
  ): Promise<IPrepareL1TxnResponse> => {
    const response = await axiosBase.post(
      `/key/prepare-l1-txn`,
      JSON.stringify(transactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
};
