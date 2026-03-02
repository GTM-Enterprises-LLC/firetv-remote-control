import { FiRewind, FiPlay, FiFastForward } from 'react-icons/fi';
import { useFireTVStore } from '../../store/firetv-store';

export default function PlaybackControls() {
  const { pressKey } = useFireTVStore();

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => pressKey('rewind')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
        title="Rewind"
      >
        <FiRewind size={18} />
      </button>

      <button
        onClick={() => pressKey('play_pause')}
        className="w-14 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center
                   text-white transition-colors active:scale-95"
        title="Play/Pause"
      >
        <FiPlay size={18} />
      </button>

      <button
        onClick={() => pressKey('fast_forward')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
        title="Fast Forward"
      >
        <FiFastForward size={18} />
      </button>
    </div>
  );
}
