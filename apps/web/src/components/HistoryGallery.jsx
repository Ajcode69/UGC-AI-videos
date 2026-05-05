import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiVideo, FiImage, FiTrendingUp, FiTarget, FiActivity } from 'react-icons/fi';

const HistoryGallery = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ads/history');
        if (response.data && response.data.data) {
          setHistory(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch history", err);
        setError("Failed to load generation history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-gray-400">Loading history...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-400 bg-red-400/10 rounded-xl">{error}</div>;
  }

  if (history.length === 0) {
    return <div className="text-center p-8 text-gray-400 bg-dark-surface rounded-xl">No generation history found. Run the seeder script!</div>;
  }

  return (
    <div className="space-y-8">
      {history.map((item) => (
        <div key={item.id} className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden flex flex-col xl:flex-row shadow-xl">
          {/* Media Section */}
          <div className="w-full xl:w-1/3 flex flex-col sm:flex-row xl:flex-col bg-black">
            <div className="relative w-full sm:w-1/2 xl:w-full border-b xl:border-b-0 border-dark-border">
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-xs font-semibold px-2 py-1 rounded-md text-white flex items-center gap-1 z-10">
                <FiImage className="text-blue-400" /> Input Photo
              </div>
              <img src={item.photo_url} alt="Product Input" className="w-full h-48 xl:h-64 object-cover" />
            </div>
            <div className="relative w-full sm:w-1/2 xl:w-full">
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-xs font-semibold px-2 py-1 rounded-md text-white flex items-center gap-1 z-10">
                <FiVideo className="text-green-400" /> AI Video
              </div>
              <video src={item.video_url} controls className="w-full h-48 xl:h-64 object-cover" />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full xl:w-2/3 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wider">{item.status}</span>
                <p className="text-gray-500 text-xs mt-2 flex items-center gap-1"><FiClock /> {new Date(item.created_at || Date.now()).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">ID: {item.id}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-2">Prompt Used</h4>
              <p className="text-gray-200 text-sm bg-dark-bg p-3 rounded-lg border border-dark-border">{item.prompt_used}</p>
            </div>

            {item.market_research && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1">
                <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
                  <h4 className="text-primary font-semibold flex items-center gap-2 mb-2"><FiTarget /> Market Persona</h4>
                  <p className="text-white font-medium text-sm mb-1">{item.market_research.market}</p>
                  <p className="text-gray-400 text-xs">Targeting: {item.market_research.personas?.join(', ')}</p>
                </div>
                <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
                  <h4 className="text-orange-400 font-semibold flex items-center gap-2 mb-2"><FiActivity /> Campaign Strategy</h4>
                  <p className="text-white text-sm mb-1">"{item.market_research.campaign?.hook}"</p>
                  <p className="text-gray-400 text-xs">Platforms: {item.market_research.campaign?.platform}</p>
                </div>
              </div>
            )}

            {item.analytics && (
              <div className="border-t border-dark-border pt-4">
                <h4 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-2"><FiTrendingUp /> Predicted Performance</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">IG Retention</p>
                    <p className="text-lg font-bold text-white">{item.analytics.instagram?.retentionFirst3s}</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">IG Views</p>
                    <p className="text-lg font-bold text-white">{item.analytics.instagram?.views}</p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Amazon Lift</p>
                    <p className="text-lg font-bold text-green-400">{item.analytics.amazon?.conversionLift}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryGallery;
