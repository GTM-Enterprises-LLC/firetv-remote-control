export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface StatusData {
  connected: boolean;
  deviceIp: string;
}

export interface FireTVDeviceInfo {
  model: string | null;
  manufacturer: string | null;
  android_version: string | null;
  serial: string | null;
}

export interface FireTVNowPlaying {
  app_package: string | null;
  app_name: string | null;
  state: 'play' | 'pause' | 'idle';
  volume: number | null;
  screen_on: boolean;
  media_title: string | null;
  media_artist: string | null;
}

export interface FireTVConfig {
  deviceIp: string;
}
