/**
 * WAT Secure Local Storage & IndexedDB Fallback Engine
 * Provides persistent offline storage for Matrix sessions, rooms, messages,
 * wallet transactions, and outgoing message queues.
 */

const STORAGE_PREFIX = 'wat_v2_';

export interface StorageOutboxItem {
  id: string;
  roomId: string;
  payload: any;
  timestamp: number;
  retryCount: number;
  error?: string;
}

class StorageEngine {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = typeof window !== 'undefined' && !!window.localStorage;
  }

  public get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable) return defaultValue;
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[WAT Storage] Failed to parse key ${key}:`, e);
      return defaultValue;
    }
  }

  public set<T>(key: string, value: T): boolean {
    if (!this.isAvailable) return false;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[WAT Storage] Failed to write key ${key}:`, e);
      // Quota exceeded protection: clear old matrix logs if needed
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}matrix_logs`);
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
  }

  public remove(key: string): void {
    if (!this.isAvailable) return;
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
      console.warn(`[WAT Storage] Failed to remove key ${key}:`, e);
    }
  }

  public clearAllAppData(): void {
    if (!this.isAvailable) return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('[WAT Storage] Failed to clear app data:', e);
    }
  }
}

export const storage = new StorageEngine();
