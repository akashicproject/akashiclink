import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import axios from 'axios';

import { getManifestJson } from './hooks/useCurrentAppInfo';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Ap-Client': Capacitor.getPlatform(),
  },
  withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
  try {
    const appInfo = await App.getInfo();
    if (appInfo) {
      config.headers['Ap-Version'] = appInfo.version;
    }
  } catch {
    // App.getInfo() does not work on web. Try manifest
    let version = sessionStorage.getItem('version');
    version ??= (await getManifestJson()).version;
    config.headers['Ap-Version'] = version;
  }

  return config;
});

// Transform API responses to convert serialized data back to proper types
instance.interceptors.response.use((res) => ({
  ...res,
  data: dataTransformer(res.data as ResponseObject | ResponseArray),
}));

const ISO_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-([0-2][1-9]|[1-3]0|31)T/;

type Primitive = string | number | boolean | null | undefined;
type ResponseValue =
  | Primitive
  | Date
  | Map<string, unknown>
  | ResponseObject
  | ResponseArray;
type ResponseObject = { [key: string]: ResponseValue };
type ResponseArray = ResponseValue[];

/**
 * Transform the API response's data so that the values that get serialized over the wire
 * like Date and Map get converted back before using them in the front end. This way
 * we can use the same types defined in the front end with no errors
 */
export function dataTransformer<T extends ResponseObject | ResponseArray>(
  data: T
): T {
  // if it is primitive, return instantly
  if (data !== Object(data)) return data;

  if (Array.isArray(data)) {
    // Check if the array contains strings
    if (data.length > 0 && typeof data[0] === 'string') {
      return data as T;
    }
    return data.map((val) => {
      if (typeof val === 'object' && val !== null) {
        return dataTransformer(val as ResponseObject);
      }
      return val;
    }) as T;
  }

  const dataWithConvertedTypes = Object.fromEntries(
    Object.entries(data).map(([key, value]): [string, ResponseValue] => {
      if (key === 'updatedBalance') {
        return [key, new Map(Object.entries(value as Record<string, unknown>))];
      }
      if (
        value &&
        typeof value === 'string' &&
        RegExp(ISO_DATE_REGEX).exec(value)
      ) {
        return [key, new Date(value)];
      }
      if (typeof value === 'object' && value !== null) {
        return [key, dataTransformer(value as ResponseObject)];
      }
      return [key, value as ResponseValue];
    })
  );

  return dataWithConvertedTypes as T;
}

export const axiosBase = instance;
