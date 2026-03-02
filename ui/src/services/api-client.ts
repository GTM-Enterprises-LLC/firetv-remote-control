import axios from 'axios';
import type {
  ApiResponse,
  StatusData,
  FireTVDeviceInfo,
  FireTVNowPlaying,
  FireTVConfig,
} from '../types/api';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api/v1';
const http = axios.create({ baseURL: BASE_URL });

export const fireTVApi = {
  getStatus: () =>
    http.get<ApiResponse<StatusData>>('/status').then((r) => r.data),

  getDeviceInfo: () =>
    http.get<ApiResponse<FireTVDeviceInfo>>('/device-info').then((r) => r.data),

  getNowPlaying: () =>
    http.get<ApiResponse<FireTVNowPlaying>>('/now-playing').then((r) => r.data),

  getKeys: () =>
    http.get<ApiResponse<string[]>>('/keys').then((r) => r.data),

  getConfig: () =>
    http.get<ApiResponse<FireTVConfig>>('/config').then((r) => r.data),

  updateConfig: (deviceIp: string) =>
    http.put<ApiResponse<FireTVConfig>>('/config', { deviceIp }).then((r) => r.data),

  press: (key: string) =>
    http.post<ApiResponse<{ key: string }>>(`/keypress/${key}`).then((r) => r.data),

  launchApp: (app: string) =>
    http.post<ApiResponse<unknown>>(`/launch/${app}`).then((r) => r.data),

  type: (text: string) =>
    http.post<ApiResponse<unknown>>('/type', { text }).then((r) => r.data),
};
