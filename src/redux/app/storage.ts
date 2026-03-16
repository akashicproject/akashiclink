import storage from 'redux-persist/lib/storage';

class CapacitorBackwardCompatibleStorage {
  async getItem(key: string) {
    return await storage.getItem(`CapacitorStorage.${key}`);
  }

  async setItem(key: string, value: string) {
    return await storage.setItem(`CapacitorStorage.${key}`, value);
  }
  async removeItem(key: string) {
    return await storage.removeItem(`CapacitorStorage.${key}`);
  }
}

export default new CapacitorBackwardCompatibleStorage();
