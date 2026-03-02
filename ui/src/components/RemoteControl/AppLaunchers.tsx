import { useFireTVStore } from '../../store/firetv-store';
import clsx from 'clsx';

const APPS: { key: string; label: string; color: string }[] = [
  { key: 'prime',   label: 'Prime',   color: 'text-blue-400' },
  { key: 'netflix', label: 'Netflix', color: 'text-red-500' },
  { key: 'disney',  label: 'Disney+', color: 'text-blue-500' },
  { key: 'hulu',    label: 'Hulu',    color: 'text-green-400' },
  { key: 'max',     label: 'Max',     color: 'text-purple-400' },
  { key: 'youtube', label: 'YT',      color: 'text-red-400' },
];

export default function AppLaunchers() {
  const { launchApp } = useFireTVStore();

  return (
    <div className="grid grid-cols-3 gap-2">
      {APPS.map(({ key, label, color }) => (
        <button
          key={key}
          onClick={() => launchApp(key)}
          className={clsx(
            'h-9 rounded-xl bg-white/5 hover:bg-white/10',
            'flex items-center justify-center',
            'text-xs font-semibold transition-colors active:scale-95',
            color
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
