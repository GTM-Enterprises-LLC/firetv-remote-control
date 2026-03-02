import { FiPlay, FiPause, FiTv, FiVolume2, FiVolumeX, FiMonitor } from 'react-icons/fi';
import { useFireTVStore } from '../store/firetv-store';

const STATE_ICON: Record<string, React.ReactNode> = {
  play:  <FiPlay size={12} className="text-green-400" />,
  pause: <FiPause size={12} className="text-yellow-400" />,
};

export default function NowPlaying() {
  const { nowPlaying, isConnected } = useFireTVStore();

  if (!isConnected) return null;

  const appName = nowPlaying?.app_name ?? null;
  const state = nowPlaying?.state ?? 'idle';
  const isIdle = state === 'idle';
  const volume = nowPlaying?.volume ?? null;
  const screenOn = nowPlaying?.screen_on ?? true;
  const mediaTitle = nowPlaying?.media_title ?? null;
  const mediaArtist = nowPlaying?.media_artist ?? null;

  return (
    <div className="w-full max-w-[280px] mx-auto mb-3">
      <div className="bg-gray-800/60 border border-white/5 rounded-2xl px-4 py-3 space-y-2">
        {/* App + playback state row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FiTv size={13} className="text-gray-500 shrink-0" />
            <span className="text-sm font-medium text-white truncate">
              {appName ?? '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!screenOn && (
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <FiMonitor size={11} /> off
              </span>
            )}
            {!isIdle && STATE_ICON[state] && (
              <div className="flex items-center gap-1">
                {STATE_ICON[state]}
                <span className="text-xs text-gray-400 capitalize">{state}</span>
              </div>
            )}
            {isIdle && <span className="text-xs text-gray-600">idle</span>}
          </div>
        </div>

        {/* Media title / artist */}
        {mediaTitle && (
          <div className="pl-5 space-y-0.5">
            <p className="text-xs text-white truncate">{mediaTitle}</p>
            {mediaArtist && (
              <p className="text-xs text-gray-500 truncate">{mediaArtist}</p>
            )}
          </div>
        )}

        {/* Volume bar */}
        {volume !== null && (
          <div className="flex items-center gap-2 pt-0.5">
            {volume === 0
              ? <FiVolumeX size={11} className="text-gray-500 shrink-0" />
              : <FiVolume2 size={11} className="text-gray-500 shrink-0" />
            }
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${volume}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-5 text-right">{volume}</span>
          </div>
        )}
      </div>
    </div>
  );
}
