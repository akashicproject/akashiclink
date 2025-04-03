import type {
  IDiffconKeysDto,
  IDiffconKeysResponse,
  IEstimateGasFee,
  IEstimateGasFeeResponse,
  IL1ClientSideOtkTransactionBase,
  ILoginUserWithOtk,
  ILookForL2Address,
  ILookForL2AddressResponse,
  IMinimalUserResponse,
  IRetrieveIdentity,
  IRetrieveIdentityResponse,
  ITransactionProposal,
  ITransactionSettledResponse,
  ITransactionVerifyResponse,
  ITransferNft,
  ITransferNftResponse,
  ITransferNftUsingClientSideOtk,
  IUpdateAcns,
  IUpdateAcnsResponse,
  IUpdateAcnsUsingClientSideOtk,
  IVerifyNftResponse,
  IVerifyUpdateAcnsResponse,
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

  verifyTransactionUsingClientSideOtk: async (
    transactionData: ITransactionProposal
  ): Promise<ITransactionVerifyResponse[]> => {
    const response = await axiosBaseV1.post(
      `/key/verify-txns`,
      JSON.stringify(transactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },

  sendL1TransactionUsingClientSideOtk: async (
    transactionToSendData: IL1ClientSideOtkTransactionBase[]
  ): Promise<ITransactionSettledResponse[]> => {
    const response = await axiosBaseV1.post(
      `/key/send/l1`,
      JSON.stringify(transactionToSendData)
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

  diffconKeys: async (
    payload: IDiffconKeysDto
  ): Promise<IDiffconKeysResponse> => {
    const response = await axiosBase.post(
      `/auth/diffcon-keys`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return data as IDiffconKeysResponse;
  },

  verifyNftTransaction: async (
    payload: ITransferNft
  ): Promise<IVerifyNftResponse> => {
    const response = await axiosBaseV1.post(
      `/nft/verify`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  nftTransferUsingClientSideOtk: async (
    payload: ITransferNftUsingClientSideOtk
  ): Promise<ITransferNftResponse> => {
    const response = await axiosBaseV1.post(
      `/nft/transfer`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  verifyUpdateAcns: async (
    payload: IUpdateAcns
  ): Promise<IVerifyUpdateAcnsResponse> => {
    const response = await axiosBaseV1.post(
      `/nft/acns/verify`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
  },

  updateAcnsUsingClientSideOtk: async (
    payload: IUpdateAcnsUsingClientSideOtk
  ): Promise<IUpdateAcnsResponse> => {
    const response = await axiosBaseV1.post(
      `/nft/acns`,
      JSON.stringify(payload)
    );
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
};
