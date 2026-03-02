import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFireTVStore } from '../../store/firetv-store';

export default function NavigationPad() {
  const { pressKey } = useFireTVStore();

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Up */}
      <button
        onClick={() => pressKey('up')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
      >
        <FiChevronUp size={20} />
      </button>

      {/* Left / Select / Right */}
      <div className="flex gap-1">
        <button
          onClick={() => pressKey('left')}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                     text-gray-300 hover:text-white transition-colors active:scale-95"
        >
          <FiChevronLeft size={20} />
        </button>

        <button
          onClick={() => pressKey('select')}
          className="w-14 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center
                     text-white font-semibold text-xs transition-colors active:scale-95"
        >
          OK
        </button>

        <button
          onClick={() => pressKey('right')}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                     text-gray-300 hover:text-white transition-colors active:scale-95"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* Down */}
      <button
        onClick={() => pressKey('down')}
        className="w-12 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center
                   text-gray-300 hover:text-white transition-colors active:scale-95"
      >
        <FiChevronDown size={20} />
      </button>
    </div>
  );
}
