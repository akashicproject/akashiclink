import { type OtkType } from '@akashic/as-backend';
import axios from 'axios';

import { chooseBestNodes, PortType } from './nitr0gen/nitr0gen.utils';

type IdentityAuthority = {
  public: string;
  type: string;
  label?: OtkType;
  hash: string;
  stake: number;
};

type IdentityAuthoritiesDetail = {
  umid: string;
  authorities: IdentityAuthority[];
};

const apiCall = async <T>(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  data?: unknown
): Promise<T> => {
  const NITR0_URL = await chooseBestNodes(PortType.NFT);

  const response = await axios
    .create({
      baseURL: NITR0_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    })
    .request<T>({
      url,
      method,
      data,
    });
  return response.data;
};

export const ChainAPI = {
  findIdentityStream: async (data: {
    identity: string;
  }): Promise<IdentityAuthoritiesDetail> => {
    const url = `${data.identity}:stream`;
    return await apiCall<IdentityAuthoritiesDetail>(url);
  },
};
