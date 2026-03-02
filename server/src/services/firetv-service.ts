import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';

const exec = promisify(execCb);

export const FIRETV_KEYS: Record<string, number> = {
  up: 19,
  down: 20,
  left: 21,
  right: 22,
  select: 66,
  back: 4,
  home: 3,
  menu: 1,
  power: 26,
  sleep: 223,
  mic: 84,
  search: 84,
  volume_up: 24,
  volume_down: 25,
  volume_mute: 164,
  play_pause: 85,
  rewind: 89,
  fast_forward: 90,
  media_next: 87,
  media_prev: 88,
};

// App package → adb am start intent for app launchers
export const APP_INTENTS: Record<string, string> = {
  netflix:   'com.netflix.ninja/.StartupActivity',
  prime:     'com.amazon.avod.thirdpartyclient/.StartupActivity',
  disney:    'com.disney.disneyplus/com.bamtechMedia.grogu.ui.main.LaunchActivity',
  hulu:      'com.hulu.plus/com.hulu.features.splash.SplashActivity',
  youtube:   'com.google.android.youtube.tv/com.google.android.apps.youtube.tv.activity.ShellActivity',
  max:       'com.max.android.tv/.launch.LaunchActivity',
  peacock:   'com.peacocktv.peacockandroid/.ui.splash.SplashActivity',
  spotify:   'com.spotify.tv.android/.SpotifyTVActivity',
  plex:      'com.plexapp.android/.SplashActivity',
  tubi:      'com.tubi.tv/.activity.StartActivity',
  appletv:   'com.apple.atve.amazon.appletv/.activity.SplashActivity',
};

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

// Friendly name map for common FireTV app packages
const APP_NAMES: Record<string, string> = {
  'com.amazon.tv.launcher': 'Home',
  'com.netflix.ninja': 'Netflix',
  'com.amazon.avod.thirdpartyclient': 'Prime Video',
  'com.hulu.plus': 'Hulu',
  'com.disney.disneyplus': 'Disney+',
  'com.apple.atve.amazon.appletv': 'Apple TV',
  'com.max.android.tv': 'Max',
  'com.hbo.hbonow': 'HBO',
  'com.peacocktv.peacockandroid': 'Peacock',
  'com.paramountnetwork.pplus': 'Paramount+',
  'com.espn.score_center': 'ESPN',
  'com.youtube.tv': 'YouTube TV',
  'com.google.android.youtube.tv': 'YouTube',
  'com.amazon.bueller': 'Amazon Music',
  'com.spotify.tv.android': 'Spotify',
  'com.twitch.tv': 'Twitch',
  'com.pluto.tv': 'Pluto TV',
  'com.crunchyroll.crunchyroid': 'Crunchyroll',
  'com.fubo.fuboTV': 'FuboTV',
  'tv.sling.android': 'Sling TV',
  'com.directv.dtvatl': 'DirecTV Stream',
  'com.tubi.tv': 'Tubi',
  'com.plex': 'Plex',
  'com.amazon.photo': 'Amazon Photos',
  'com.amazon.settings': 'Settings',
};

function resolveAdbPath(): string {
  if (process.env.FIRETV_ADB_PATH) return process.env.FIRETV_ADB_PATH;
  const localPath = join(process.cwd(), '..', 'platform-tools', 'adb');
  if (existsSync(localPath)) return localPath;
  return 'adb';
}

export class FireTVService {
  private deviceId: string;
  private adbPath: string;

  constructor(private ip: string) {
    this.deviceId = `${ip}:5555`;
    this.adbPath = resolveAdbPath();
  }

  private adb(args: string): Promise<{ stdout: string; stderr: string }> {
    return exec(`${this.adbPath} ${args}`, { timeout: 8000 });
  }

  async connect(): Promise<void> {
    const { stdout } = await this.adb(`connect ${this.deviceId}`);
    if (stdout.includes('refused') || stdout.includes('failed')) {
      throw new Error(`ADB connect failed: ${stdout.trim()}`);
    }
  }

  async disconnect(): Promise<void> {
    await this.adb(`disconnect ${this.deviceId}`);
  }

  async isConnected(): Promise<boolean> {
    try {
      const { stdout } = await this.adb('devices');
      return stdout.includes(this.deviceId) && stdout.includes('device\n');
    } catch {
      return false;
    }
  }

  async press(key: string): Promise<void> {
    const code = FIRETV_KEYS[key];
    if (code === undefined) throw new Error(`Unknown key: ${key}`);
    await this.adb(`-s ${this.deviceId} shell input keyevent ${code}`);
  }

  async type(text: string): Promise<void> {
    const escaped = text.replace(/[^a-zA-Z0-9]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
    await this.adb(`-s ${this.deviceId} shell input text "${escaped}"`);
  }

  async getDeviceInfo(): Promise<FireTVDeviceInfo> {
    try {
      const { stdout } = await this.adb(
        `-s ${this.deviceId} shell getprop ro.product.model && ` +
        `${this.adbPath} -s ${this.deviceId} shell getprop ro.product.manufacturer && ` +
        `${this.adbPath} -s ${this.deviceId} shell getprop ro.build.version.release && ` +
        `${this.adbPath} -s ${this.deviceId} shell getprop ro.serialno`
      );
      const [model, manufacturer, android_version, serial] = stdout.trim().split('\n');
      return {
        model: model?.trim() || null,
        manufacturer: manufacturer?.trim() || null,
        android_version: android_version?.trim() || null,
        serial: serial?.trim() || null,
      };
    } catch {
      return { model: null, manufacturer: null, android_version: null, serial: null };
    }
  }

  async getNowPlaying(): Promise<FireTVNowPlaying> {
    try {
      const [windowResult, mediaResult, volumeResult, powerResult] = await Promise.allSettled([
        this.adb(`-s ${this.deviceId} shell "dumpsys window windows | grep -m1 mCurrentFocus"`),
        this.adb(`-s ${this.deviceId} shell "dumpsys media_session | grep -E 'state=PlaybackState|description='"`),
        this.adb(`-s ${this.deviceId} shell media volume --get --stream 3`),
        this.adb(`-s ${this.deviceId} shell "dumpsys power | grep -m1 mWakefulness"`),
      ]);

      // Current focused app
      let app_package: string | null = null;
      if (windowResult.status === 'fulfilled') {
        const m = windowResult.value.stdout.match(/mCurrentFocus=Window\{[^}]+\s+([^\s/]+)/);
        if (m) app_package = m[1];
      }
      const app_name = app_package ? (APP_NAMES[app_package] ?? app_package.split('.').pop() ?? null) : null;

      // Media state + title/artist
      let state: FireTVNowPlaying['state'] = 'idle';
      let media_title: string | null = null;
      let media_artist: string | null = null;
      if (mediaResult.status === 'fulfilled') {
        const out = mediaResult.value.stdout;
        const stateMatch = out.match(/state=PlaybackState\s*\{[^}]*state=(\d+)/);
        if (stateMatch) {
          const s = parseInt(stateMatch[1]);
          if (s === 3) state = 'play';
          else if (s === 2) state = 'pause';
        }
        // description=<title>, <artist>, <album>
        const descMatch = out.match(/description=([^,\n]+),\s*([^,\n]+)/);
        if (descMatch && state !== 'idle') {
          media_title = descMatch[1].trim() || null;
          media_artist = descMatch[2].trim() || null;
        }
      }

      // Volume (0-100)
      let volume: number | null = null;
      if (volumeResult.status === 'fulfilled') {
        const m = volumeResult.value.stdout.match(/volume is (\d+)/);
        if (m) volume = parseInt(m[1]);
      }

      // Screen on/off
      let screen_on = true;
      if (powerResult.status === 'fulfilled') {
        const m = powerResult.value.stdout.match(/mWakefulness=(\w+)/);
        if (m) screen_on = m[1] === 'Awake';
      }

      return { app_package, app_name, state, volume, screen_on, media_title, media_artist };
    } catch {
      return { app_package: null, app_name: null, state: 'idle', volume: null, screen_on: true, media_title: null, media_artist: null };
    }
  }

  async launchApp(appKey: string): Promise<void> {
    const intent = APP_INTENTS[appKey];
    if (!intent) throw new Error(`Unknown app: ${appKey}. Valid apps: ${Object.keys(APP_INTENTS).join(', ')}`);
    await this.adb(`-s ${this.deviceId} shell am start -n ${intent}`);
  }

  updateIp(ip: string): void {
    this.ip = ip;
    this.deviceId = `${ip}:5555`;
  }
}
