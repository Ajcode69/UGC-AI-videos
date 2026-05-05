import { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiTarget, FiCrosshair, FiCpu, FiCheckCircle, FiFileText } from 'react-icons/fi';

const ResearchAgents = () => {
  const [formData, setFormData] = useState({
    productDescription: '',
    targetMarket: '',
    objectives: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('synthesis');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productDescription) {
      setError("Product description is required.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/research/full', formData);
      setResult(response.data);
      setActiveTab('synthesis');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to run research pipeline.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'synthesis', label: 'Executive Summary' },
    { id: 'market_research', label: 'Market Analysis' },
    { id: 'competitor_analysis', label: 'Competitors' },
    { id: 'persona_generation', label: 'Personas' },
    { id: 'swot_analysis', label: 'SWOT' },
    { id: 'campaign_strategy', label: 'Campaign' }
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Form Section */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 xl:p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <FiCpu className="text-white text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Initialize AI Agents</h3>
            <p className="text-gray-400 text-sm">Deploy the LangGraph multi-agent swarm for full market intelligence.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <FiFileText className="text-primary" /> Product/Service Description *
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              rows="3"
              className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              placeholder="E.g., A premium health-tracking smart ring with LED sensors..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FiTarget className="text-orange-400" /> Target Market (Optional)
              </label>
              <input
                type="text"
                name="targetMarket"
                value={formData.targetMarket}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="E.g., Biohackers, fitness enthusiasts"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FiCrosshair className="text-green-400" /> Objectives (Optional)
              </label>
              <input
                type="text"
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="E.g., Find top 3 competitors and ad angles"
              />
            </div>
          </div>

          {error && <div className="text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-xl text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              loading 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 shadow-primary/20'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <FiCpu className="animate-spin" /> Deploying Agent Swarm (This may take 10-30s)...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiSearch /> Run Deep Market Research
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {result && result.data && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-black/50 border-b border-dark-border px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-green-400">
              <FiCheckCircle /> Research Complete
            </h3>
            <span className="text-xs text-gray-500 font-mono bg-dark-bg px-2 py-1 rounded">Duration: {result.duration}</span>
          </div>
          
          <div className="flex border-b border-dark-border overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-dark-bg/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 xl:p-8 bg-dark-bg/30">
            <div className="prose prose-invert max-w-none">
              <pre className="text-gray-300 font-sans whitespace-pre-wrap leading-relaxed">
                {activeTab === 'synthesis' 
                  ? result.data.synthesis 
                  : result.data.sections[activeTab]}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchAgents;
