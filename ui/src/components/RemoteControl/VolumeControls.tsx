import { FiVolume2, FiVolumeX, FiVolume1 } from 'react-icons/fi';
import { useFireTVStore } from '../../store/firetv-store';

export default function VolumeControls() {
  const { pressKey } = useFireTVStore();

  return (
    <div className="flex justify-center gap-3">
      <button
        onClick={() => pressKey('volume_down')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
        title="Volume Down"
      >
        <FiVolume1 size={18} />
      </button>

      <button
        onClick={() => pressKey('volume_mute')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
        title="Mute"
      >
        <FiVolumeX size={18} />
      </button>

      <button
        onClick={() => pressKey('volume_up')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
        title="Volume Up"
      >
        <FiVolume2 size={18} />
      </button>
    </div>
  );
}
