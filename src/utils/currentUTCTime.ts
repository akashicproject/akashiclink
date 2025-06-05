import { axiosBase } from './axios-helper';

export async function getCurrentTime(): Promise<number> {
  const { data } = await axiosBase.get<number>('/config/current-time');
  return data;
}
