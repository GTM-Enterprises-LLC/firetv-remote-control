import { Router } from 'express';
import { FireTVController } from '../controllers/firetv-controller';
import { asyncHandler } from '../middleware/error-handler';

export function createRouter(controller: FireTVController): Router {
  const router = Router();

  router.get('/status', asyncHandler(controller.getStatus));
  router.get('/device-info', asyncHandler(controller.getDeviceInfo));
  router.get('/now-playing', asyncHandler(controller.getNowPlaying));
  router.get('/keys', asyncHandler(controller.getKeys));
  router.get('/config', asyncHandler(controller.getConfig));
  router.put('/config', asyncHandler(controller.putConfig));
  router.get('/apps', asyncHandler(controller.getApps));
  router.post('/keypress/:key', asyncHandler(controller.postKeypress));
  router.post('/launch/:app', asyncHandler(controller.postLaunchApp));
  router.post('/type', asyncHandler(controller.postType));

  return router;
}
