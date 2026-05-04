import { useState } from 'react';
import axios from 'axios';
import './AdGenerator.css'; // Keep styling modular

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
      // Point this to your api server (e.g. localhost:5000)
      const response = await axios.post('http://localhost:5000/api/ads/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${user.token}` // Pass token if backend verifies
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
    <div className="generator-container">
      <h2>Generate Your Ad</h2>
      
      <form onSubmit={handleGenerate} className="generator-form">
        <div className="form-group">
          <label>Upload Product Photo:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        
        <div className="form-group">
          <label>Additional Instructions (Optional):</label>
          <textarea 
            placeholder="E.g., Make it sound luxurious and targeting young adults..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading || !file}>
          {loading ? 'Generating AI Magic...' : 'Generate Ad'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-container">
          <h3>Generated Ad Copy</h3>
          <div className="ad-content">
            {/* simple rendering of markdown or plain text */}
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdGenerator;
