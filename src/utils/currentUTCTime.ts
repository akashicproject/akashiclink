import { axiosBase } from './axios-helper';

export async function getCurrentTime(): Promise<number> {
  const { data } = await axiosBase.get<number>('/v0/config/current-time');
  return data;
}
