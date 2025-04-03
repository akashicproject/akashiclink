import type {
  IActivateWalletAccount,
  IActivateWalletAccountClientOtk,
  IActivateWalletAccountClientOtkResponse,
  IActivateWalletAccountResponse,
  IChangePassword,
  IConfirmPassword,
  ICreateKeysDto,
  ICreateKeysResponse,
  IDiffconKeysDto,
  IDiffconKeysResponse,
  IEstimateGasFee,
  IEstimateGasFeeResponse,
  IImportWalletNew,
  IImportWalletResponseNew,
  IL1ClientSideOtkTransactionBase,
  ILoginUser,
  ILoginUserWithOtk,
  ILookForL2Address,
  ILookForL2AddressResponse,
  IMinimalUserResponse,
  IRequestActivationCode,
  IRequestActivationCodeResponse,
  ITransactionBase,
  ITransactionProposal,
  ITransactionProposalClientSideOtk,
  ITransactionSettledResponse,
  ITransactionVerifyResponse,
  ITransferNft,
  ITransferNftResponse,
  ITransferNftUsingClientSideOtk,
  IUpdateAcns,
  IUpdateAcnsResponse,
  IUpdateAcnsUsingClientSideOtk,
  IValidatePassword,
  IVerifyNftResponse,
  IVerifyUpdateAcnsResponse,
} from '@helium-pay/backend';

import { axiosBase, axiosBaseV1 } from './axios-helper';

export const OwnersAPI = {
  importAccount: async (
    importData: IImportWalletNew
  ): Promise<IImportWalletResponseNew> => {
    const response = await axiosBase.post(
      `/auth/import-wallet`,
      JSON.stringify(importData)
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

  login: async (loginData: ILoginUser): Promise<IMinimalUserResponse> => {
    const response = await axiosBase.post(
      `/auth/login`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  validatePassword: async (loginData: IValidatePassword): Promise<void> => {
    const response = await axiosBase.post(
      `/auth/validatePassword`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },
  confirmPassword: async (
    loginData: IConfirmPassword
  ): Promise<IMinimalUserResponse> => {
    const response = await axiosBase.post(
      `/auth/confirm-password`,
      JSON.stringify(loginData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },
  verifyTransaction: async (
    transactionData: ITransactionProposal
  ): Promise<ITransactionVerifyResponse[]> => {
    const response = await axiosBase.post(
      `/key/verify-txns`,
      JSON.stringify(transactionData)
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

  sendL1Transaction: async (
    transactionToSendData: ITransactionBase[]
  ): Promise<ITransactionSettledResponse[]> => {
    const response = await axiosBase.post(
      `/key/send/l1`,
      JSON.stringify(transactionToSendData)
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

  sendL2Transaction: async (
    signedTransactionData: ITransactionProposal
  ): Promise<ITransactionSettledResponse> => {
    const response = await axiosBase.post(
      `/key/send/l2`,
      JSON.stringify(signedTransactionData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },

  sendL2TransactionUsingClientSideOtk: async (
    signedTransactionData: ITransactionProposalClientSideOtk
  ): Promise<ITransactionSettledResponse> => {
    const response = await axiosBaseV1.post(
      `/key/send/l2`,
      JSON.stringify(signedTransactionData)
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

  changePassword: async (
    changePasswordData: IChangePassword
  ): Promise<void> => {
    const response = await axiosBase.post(
      `/auth/change-password`,
      JSON.stringify(changePasswordData)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
  },

  requestActivationCode: async function (
    payload: IRequestActivationCode
  ): Promise<IRequestActivationCodeResponse> {
    const response = await axiosBase.post(
      `/auth/request-2fa-activation`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }

    return response.data;
  },

  activateNewAccount: async (
    payload: IActivateWalletAccount
  ): Promise<IActivateWalletAccountResponse> => {
    const response = await axiosBase.post(
      `/auth/activate-wallet-account`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return data as IActivateWalletAccountResponse;
  },

  activateNewAccountWithClientSideOtk: async (
    payload: IActivateWalletAccountClientOtk
  ): Promise<IActivateWalletAccountClientOtkResponse> => {
    const response = await axiosBaseV1.post(
      `/auth/activate-wallet-account`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return data as IActivateWalletAccountClientOtkResponse;
  },

  claimOrCreateKeys: async (
    payload: ICreateKeysDto
  ): Promise<ICreateKeysResponse> => {
    const response = await axiosBase.post(
      `/auth/claim-keys`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return data as ICreateKeysResponse;
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

  nftTransfer: async (payload: ITransferNft): Promise<ITransferNftResponse> => {
    const response = await axiosBase.post(
      `/nft/transfer`,
      JSON.stringify(payload)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
    return response.data;
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

  updateAcns: async (updateAcns: IUpdateAcns) => {
    const response = await axiosBase.post(
      `/nft/acns`,
      JSON.stringify(updateAcns)
    );
    const { data, status } = response;
    if (status >= 400) {
      throw new Error(data.message);
    }
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
