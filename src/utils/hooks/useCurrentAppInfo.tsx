import { datadogRum } from '@datadog/browser-rum';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const getManifestJson = async (): Promise<Record<string, string>> => {
  const response = await axios.get<Record<string, string>>('/manifest.json', {
    data: {}, // workaround for axios
  });
  return response.data;
};

export const useCurrentAppInfo = () => {
  const [version, setVersion] = useState<string>(
    sessionStorage.getItem('version') ?? ''
  );

  useEffect(() => {
    const getManifestVersion = async () => {
      try {
        if (!version) {
          const manifestData = await getManifestJson();
          setVersion(manifestData.version);
          sessionStorage.setItem('version', manifestData.version);
        }
      } catch (e) {
        datadogRum.addError(e);
        console.warn(e);
      }
    };

    getManifestVersion();
  }, []);

  return {
    name: 'AkashicLink',
    version: version,
  };
};
