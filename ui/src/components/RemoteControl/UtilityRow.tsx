import { FiArrowLeft, FiHome, FiMenu, FiMic } from 'react-icons/fi';
import { useFireTVStore } from '../../store/firetv-store';
import clsx from 'clsx';

function UtilBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        'flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10',
        'flex items-center justify-center text-gray-300 hover:text-white',
        'transition-colors active:scale-95 text-xs gap-1'
      )}
    >
      {children}
    </button>
  );
}

export default function UtilityRow() {
  const { pressKey } = useFireTVStore();

  return (
    <div className="flex gap-2">
      <UtilBtn onClick={() => pressKey('back')} title="Back">
        <FiArrowLeft size={16} />
        <span>Back</span>
      </UtilBtn>
      <UtilBtn onClick={() => pressKey('home')} title="Home">
        <FiHome size={16} />
        <span>Home</span>
      </UtilBtn>
      <UtilBtn onClick={() => pressKey('menu')} title="Menu">
        <FiMenu size={16} />
        <span>Menu</span>
      </UtilBtn>
      <UtilBtn onClick={() => pressKey('mic')} title="Mic / Search">
        <FiMic size={16} />
      </UtilBtn>
    </div>
  );
}
