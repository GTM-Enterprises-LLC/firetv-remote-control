import { Request, Response } from 'express';
import { FireTVService, FIRETV_KEYS, APP_INTENTS } from '../services/firetv-service';
import { getConfig, updateConfig } from '../config/environment';

export class FireTVController {
  constructor(private service: FireTVService) {}

  private ok(res: Response, data: unknown) {
    res.json({ success: true, data, timestamp: new Date().toISOString() });
  }

  getStatus = async (_req: Request, res: Response): Promise<void> => {
    const connected = await this.service.isConnected();
    this.ok(res, { connected, deviceIp: getConfig().deviceIp });
  };

  getConfig = async (_req: Request, res: Response): Promise<void> => {
    this.ok(res, getConfig());
  };

  putConfig = async (req: Request, res: Response): Promise<void> => {
    const { deviceIp } = req.body as { deviceIp?: string };
    if (!deviceIp) {
      res.status(400).json({ success: false, error: { message: 'deviceIp is required' } });
      return;
    }
    updateConfig(deviceIp);
    this.service.updateIp(deviceIp);
    await this.service.connect();
    this.ok(res, { deviceIp });
  };

  getDeviceInfo = async (_req: Request, res: Response): Promise<void> => {
    const info = await this.service.getDeviceInfo();
    this.ok(res, info);
  };

  getNowPlaying = async (_req: Request, res: Response): Promise<void> => {
    const nowPlaying = await this.service.getNowPlaying();
    this.ok(res, nowPlaying);
  };

  getKeys = async (_req: Request, res: Response): Promise<void> => {
    this.ok(res, Object.keys(FIRETV_KEYS));
  };

  postKeypress = async (req: Request, res: Response): Promise<void> => {
    const { key } = req.params;
    if (!(key in FIRETV_KEYS)) {
      res.status(400).json({
        success: false,
        error: { message: `Invalid key "${key}". Valid keys: ${Object.keys(FIRETV_KEYS).join(', ')}` },
      });
      return;
    }
    await this.service.press(key);
    this.ok(res, { key });
  };

  postType = async (req: Request, res: Response): Promise<void> => {
    const { text } = req.body as { text?: string };
    if (!text) {
      res.status(400).json({ success: false, error: { message: 'text is required' } });
      return;
    }
    await this.service.type(text);
    this.ok(res, { typed: text });
  };

  getApps = async (_req: Request, res: Response): Promise<void> => {
    this.ok(res, Object.keys(APP_INTENTS));
  };

  postLaunchApp = async (req: Request, res: Response): Promise<void> => {
    const { app } = req.params;
    await this.service.launchApp(app);
    this.ok(res, { launched: app });
  };
}
