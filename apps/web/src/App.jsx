import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import AdGenerator from './components/AdGenerator';
import './App.css'; // Optional Vanilla CSS for styling

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    // Decode JWT token here to get user info if needed, but for now just mock state
    setUser({ loggedIn: true, token: credentialResponse.credential });
  };

  const handleLoginError = () => {
    console.error("Login Failed");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Ad Generator</h1>
        {!user && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        )}
      </header>

      <main className="app-main">
        {user ? (
          <AdGenerator user={user} />
        ) : (
          <div className="welcome-section">
            <p>Please log in with Google to create awesome AI ads from your photos.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
