import { FiPower, FiMoon } from 'react-icons/fi';
import { useFireTVStore } from '../../store/firetv-store';

export default function PowerButton() {
  const { pressKey } = useFireTVStore();

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => pressKey('sleep')}
        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10
                   flex items-center justify-center transition-colors active:scale-95"
        title="Sleep"
      >
        <FiMoon size={15} className="text-gray-400" />
      </button>
      <button
        onClick={() => pressKey('power')}
        className="w-10 h-10 rounded-full bg-red-900/40 hover:bg-red-700/60
                   flex items-center justify-center transition-colors active:scale-95"
        title="Power"
      >
        <FiPower size={18} className="text-red-400" />
      </button>
    </div>
  );
}
