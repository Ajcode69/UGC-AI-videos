import { useState } from 'react';
import { FiVideo, FiBarChart2, FiSettings, FiLogOut, FiPlusSquare, FiLayout } from 'react-icons/fi';
import AdGenerator from './components/AdGenerator';
import PublishingPreview from './components/PublishingPreview';

function App() {
  const [user, setUser] = useState({ name: "Demo User", loggedIn: true }); // Mock User
  const [activeView, setActiveView] = useState('generate');

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="glass-panel p-12 text-center max-w-md w-full">
           <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
              <FiVideo className="text-white text-3xl" />
           </div>
           <h1 className="text-3xl font-bold mb-2">UGC AI Studio</h1>
           <p className="text-gray-400 mb-8">Login to generate stunning UGC videos.</p>
           <button 
              onClick={() => setUser({ name: "Demo User", loggedIn: true })}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
           >
             Login with Google
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-dark-border bg-dark-surface/50 flex flex-col">
        <div className="p-6 flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <FiVideo className="text-white text-xl" />
           </div>
           <span className="font-bold text-xl tracking-tight">UGC Studio</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<FiPlusSquare />} 
            label="Generate Video" 
            active={activeView === 'generate'} 
            onClick={() => setActiveView('generate')} 
          />
          <NavItem 
            icon={<FiLayout />} 
            label="Publishing & Insights" 
            active={activeView === 'publishing'} 
            onClick={() => setActiveView('publishing')} 
          />
          <NavItem 
            icon={<FiBarChart2 />} 
            label="Research Agents" 
            active={activeView === 'research'} 
            onClick={() => setActiveView('research')} 
          />
        </nav>

        <div className="p-4 border-t border-dark-border">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-gray-700"></div>
              <div>
                 <p className="text-sm font-medium text-white">{user.name}</p>
                 <p className="text-xs text-gray-500">Pro Plan</p>
              </div>
           </div>
           <button 
             onClick={() => setUser(null)}
             className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-2 py-1"
           >
             <FiLogOut /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
         <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10"></div>
         
         <div className="p-8 pb-20">
            {activeView === 'generate' && (
              <div className="max-w-4xl mx-auto">
                 <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Create UGC Video</h2>
                    <p className="text-gray-400">Upload a product and let Veo AI generate a stunning UGC ad.</p>
                 </div>
                 <div className="glass-panel p-6">
                    <AdGenerator user={user} />
                 </div>
              </div>
            )}

            {activeView === 'publishing' && <PublishingPreview />}

            {activeView === 'research' && (
               <div className="max-w-4xl mx-auto mt-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-surface border border-dark-border mb-4">
                     <FiBarChart2 className="text-2xl text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Market Research Agents</h2>
                  <p className="text-gray-400">Connect to the backend LangGraph workflows to run full market research.</p>
                  <p className="text-sm text-primary mt-4">(UI Implementation Pending)</p>
               </div>
            )}
         </div>
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
      active 
        ? 'bg-primary/10 text-primary border border-primary/20' 
        : 'text-gray-400 hover:bg-dark-border/50 hover:text-gray-200 border border-transparent'
    }`}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </button>
);

export default App;
