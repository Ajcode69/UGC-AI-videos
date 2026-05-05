import { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiZap, FiX } from 'react-icons/fi';

const AdGenerator = ({ user }) => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a photo first.");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('additionalPrompt', prompt);

    try {
      const response = await axios.post('http://localhost:5000/api/ads/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setResult(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleGenerate} className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Photo</label>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-dark-border rounded-xl cursor-pointer bg-dark-bg/50 hover:bg-dark-border/30 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUploadCloud className="w-10 h-10 mb-3 text-primary" />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold text-white">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              {file && (
                <div className="mt-4 flex items-center gap-3 bg-dark-bg/80 px-4 py-2 rounded-lg border border-dark-border" onClick={(e) => e.preventDefault()}>
                  <p className="text-sm font-medium text-green-400 truncate max-w-[200px]">Selected: {file.name}</p>
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                    title="Remove photo"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        
        {/* Prompt Area */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Video Instructions (Optional)</label>
          <textarea 
            className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            rows="4"
            placeholder="E.g., Make the video 15 seconds long, dynamic transitions, emphasize the premium build quality..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {error && (
           <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
             {error}
           </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !file}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
            loading || !file 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 shadow-primary/25'
          }`}
        >
          <FiZap className={loading ? 'animate-pulse' : ''} />
          {loading ? 'Generating Veo Video...' : 'Generate UGC Video'}
        </button>
      </form>

      {result && (
        <div className="mt-10 border-t border-dark-border pt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <FiZap className="text-primary" /> Generation Result
          </h3>
          <div className="bg-dark-bg border border-dark-border rounded-xl p-6">
            <pre className="text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdGenerator;
