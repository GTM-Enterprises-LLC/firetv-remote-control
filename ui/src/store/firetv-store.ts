import { create } from 'zustand';
import { fireTVApi } from '../services/api-client';
import type { FireTVDeviceInfo, FireTVNowPlaying } from '../types/api';

interface FireTVStore {
  isConnected: boolean;
  deviceIp: string;
  deviceInfo: FireTVDeviceInfo | null;
  nowPlaying: FireTVNowPlaying | null;
  isExecuting: boolean;
  error: string | null;

  fetchStatus: () => Promise<void>;
  fetchDeviceInfo: () => Promise<void>;
  fetchNowPlaying: () => Promise<void>;
  pressKey: (key: string) => Promise<void>;
  launchApp: (app: string) => Promise<void>;
  typeText: (text: string) => Promise<void>;
  updateConfig: (ip: string) => Promise<void>;
  clearError: () => void;
}

export const useFireTVStore = create<FireTVStore>((set, get) => ({
  isConnected: false,
  deviceIp: '',
  deviceInfo: null,
  nowPlaying: null,
  isExecuting: false,
  error: null,

  fetchStatus: async () => {
    try {
      const res = await fireTVApi.getStatus();
      set({ isConnected: res.data.connected, deviceIp: res.data.deviceIp });
    } catch {
      set({ isConnected: false });
    }
  },

  fetchDeviceInfo: async () => {
    try {
      const res = await fireTVApi.getDeviceInfo();
      set({ deviceInfo: res.data });
    } catch {
      // non-critical
    }
  },

  fetchNowPlaying: async () => {
    try {
      const res = await fireTVApi.getNowPlaying();
      set({ nowPlaying: res.data });
    } catch {
      // non-critical
    }
  },

  pressKey: async (key: string) => {
    set({ isExecuting: true, error: null });
    try {
      await fireTVApi.press(key);
      await new Promise(r => setTimeout(r, 800));
      await get().fetchNowPlaying();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Command failed';
      set({ error: msg });
    } finally {
      set({ isExecuting: false });
    }
  },

  launchApp: async (app: string) => {
    set({ isExecuting: true, error: null });
    try {
      await fireTVApi.launchApp(app);
      await new Promise(r => setTimeout(r, 1500));
      await get().fetchNowPlaying();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Launch failed';
      set({ error: msg });
    } finally {
      set({ isExecuting: false });
    }
  },

  typeText: async (text: string) => {
    set({ isExecuting: true, error: null });
    try {
      await fireTVApi.type(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Text input failed';
      set({ error: msg });
    } finally {
      set({ isExecuting: false });
    }
  },

  updateConfig: async (ip: string) => {
    try {
      await fireTVApi.updateConfig(ip);
      set({ deviceIp: ip });
      await get().fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Config update failed';
      set({ error: msg });
    }
  },

  clearError: () => set({ error: null }),
}));
