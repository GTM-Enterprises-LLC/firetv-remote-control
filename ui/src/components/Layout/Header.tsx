import { useState } from 'react';
import { FiTv, FiSettings, FiX } from 'react-icons/fi';
import { useFireTVStore } from '../../store/firetv-store';

export default function Header() {
  const { isConnected, deviceIp, updateConfig } = useFireTVStore();
  const [showSettings, setShowSettings] = useState(false);
  const [inputIp, setInputIp] = useState('');

  const toggleSettings = () => {
    if (!showSettings) setInputIp(deviceIp || '');
    setShowSettings((v) => !v);
  };

  const handleSave = async () => {
    await updateConfig(inputIp.trim() || deviceIp);
    setShowSettings(false);
  };

  return (
    <header className="w-full bg-gray-900 border-b border-white/10 px-4 py-3">
      <div className="max-w-sm mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiTv className="text-orange-400" size={20} />
          <span className="text-white font-semibold text-sm">Fire TV Remote</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-400">{isConnected ? deviceIp : 'disconnected'}</span>
          </div>
          <button
            onClick={toggleSettings}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showSettings ? <FiX size={18} /> : <FiSettings size={18} />}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="max-w-sm mx-auto mt-3 flex gap-2">
          <input
            type="text"
            placeholder={deviceIp || '192.168.1.28'}
            value={inputIp}
            onChange={(e) => setInputIp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2
                       border border-white/10 focus:outline-none focus:border-orange-500
                       placeholder:text-gray-600"
          />
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm
                       font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Connect
          </button>
        </div>
      )}
    </header>
  );
}
