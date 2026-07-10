import { useEffect } from 'react';
import { useFireTVStore } from './store/firetv-store';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import RemoteControl from './components/RemoteControl/RemoteControl';
import NowPlaying from './components/NowPlaying';

function App() {
  const { connect, fetchStatus, fetchNowPlaying } = useFireTVStore();

  useEffect(() => {
    // Auto-connect on page load; connect() fetches device info + now-playing on success.
    connect();

    const statusInterval = setInterval(fetchStatus, 10000);
    const nowPlayingInterval = setInterval(fetchNowPlaying, 5000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(nowPlayingInterval);
    };
  }, [connect, fetchStatus, fetchNowPlaying]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <NowPlaying />
        <RemoteControl />
      </main>
      <Footer />
    </div>
  );
}

export default App;
