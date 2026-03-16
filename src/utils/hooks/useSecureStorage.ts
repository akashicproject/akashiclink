import ReactSecureLocalStorage from 'react-secure-storage';

export const useSecureStorage = () => {
  return {
    getItem: async (key: string) => {
      return ReactSecureLocalStorage.getItem(key) as string | null;
    },
    setItem: async (key: string, value: string) => {
      return ReactSecureLocalStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      try {
        ReactSecureLocalStorage.removeItem(key);
      } catch (e) {
        console.warn(e);
      }
    },
    clear: async () => {
      return ReactSecureLocalStorage.clear();
    },
  };
};
