import type { AppInfo } from '@capacitor/app';
import { App } from '@capacitor/app';
import { datadogRum } from '@datadog/browser-rum';
import { useEffect, useState } from 'react';

export const useCurrentAppInfo = () => {
  const [version, setVersion] = useState<string>();
  const [appInfo, setAppInfo] = useState<AppInfo>();

  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', '/manifest.json', true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const manifestData = JSON.parse(xhr.responseText);
          setVersion(manifestData.version);
        } catch (error) {
          datadogRum.addError(error);
        }
      }
    };
    xhr.send(null);
  }, []);

  useEffect(() => {
    const getAppInfo = async () => {
      const appInfo = await App.getInfo();
      setAppInfo(appInfo);
    };

    getAppInfo();
  }, []);

  return {
    name: appInfo?.name ?? 'Akashic Wallet',
    version: appInfo?.version ?? version,
  };
};
