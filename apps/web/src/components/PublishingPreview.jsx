import React, { useState } from 'react';
import { FiInstagram, FiShoppingCart, FiHeart, FiMessageCircle, FiSend, FiBookmark, FiTrendingUp, FiEye, FiMousePointer } from 'react-icons/fi';

const PublishingPreview = () => {
  const [activeTab, setActiveTab] = useState('instagram');

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Publishing & Insights Mock
          </h2>
          <p className="text-gray-400 mt-2">Preview how your AI generated UGC looks across platforms.</p>
        </div>
        
        <div className="flex bg-dark-surface p-1 rounded-xl border border-dark-border">
          <button
            onClick={() => setActiveTab('instagram')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'instagram' 
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FiInstagram className="text-lg" />
            Instagram
          </button>
          <button
            onClick={() => setActiveTab('amazon')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium ${
              activeTab === 'amazon' 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FiShoppingCart className="text-lg" />
            Amazon Listing
          </button>
        </div>
      </div>

      <div className="glass-panel p-6">
        {activeTab === 'instagram' ? <InstagramMock /> : <AmazonMock />}
      </div>
    </div>
  );
};

const InstagramMock = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Phone Mockup */}
      <div className="w-full lg:w-1/3 flex justify-center">
        <div className="relative w-[320px] h-[650px] bg-black rounded-[40px] border-[8px] border-gray-900 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                <div className="w-full h-full bg-gray-900 rounded-full border border-black"></div>
              </div>
              <span className="font-semibold text-sm text-white">brand_official</span>
            </div>
            <span className="text-white">•••</span>
          </div>

          {/* Video Area (Mock) */}
          <div className="flex-1 bg-gray-800 relative group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 font-medium">AI UGC Video Playing...</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white text-sm">
              <p className="font-semibold mb-1">brand_official</p>
              <p className="opacity-90">Introducing our revolutionary new product! Generated purely by AI. 🚀✨ #ai #ugc #innovation</p>
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="px-4 py-3 bg-black">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-white text-xl">
                <FiHeart className="cursor-pointer hover:text-red-500 transition-colors" />
                <FiMessageCircle className="cursor-pointer" />
                <FiSend className="cursor-pointer" />
              </div>
              <FiBookmark className="text-white text-xl cursor-pointer" />
            </div>
            <p className="text-white text-sm font-semibold mb-1">12,492 likes</p>
            <p className="text-gray-500 text-xs uppercase">2 hours ago</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FiTrendingUp className="text-pink-500" /> Real-time Post Insights
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Reach" value="145.2K" trend="+12%" icon={<FiEye className="text-blue-400" />} />
          <StatCard title="Likes" value="12,492" trend="+8%" icon={<FiHeart className="text-red-400" />} />
          <StatCard title="Comments" value="843" trend="+15%" icon={<FiMessageCircle className="text-green-400" />} />
          <StatCard title="Saves" value="3,210" trend="+22%" icon={<FiBookmark className="text-yellow-400" />} />
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 flex-1">
          <h4 className="text-lg font-medium mb-4">Audience Engagement Analysis</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Viewer Retention (First 3s)</span>
                <span className="text-white font-medium">84%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Click-Through Rate (Profile)</span>
                <span className="text-white font-medium">12.4%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary font-medium">✨ AI Suggestion:</p>
            <p className="text-gray-300 text-sm mt-1">This hook is performing 20% better than average. Generate a variation of this video emphasizing the product unboxing in the first 2 seconds to boost engagement further.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AmazonMock = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Amazon Listing Mockup */}
      <div className="w-full xl:w-[60%] border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
            <div className="text-white font-bold text-xl tracking-tighter">amazon</div>
            <div className="bg-white/20 h-8 w-64 rounded-md"></div>
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-8">
            {/* Gallery */}
            <div className="w-full md:w-1/2">
                <div className="aspect-square bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden mb-4 group cursor-pointer">
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                         <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                             <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                         </div>
                    </div>
                    <span className="text-gray-400 font-medium z-10 absolute bottom-4">AI Product Video Demo</span>
                </div>
                <div className="flex gap-2">
                    <div className="w-16 h-16 bg-gray-200 rounded border-2 border-orange-400 flex items-center justify-center text-xs text-gray-500">Vid</div>
                    <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200"></div>
                    <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200"></div>
                </div>
            </div>
            {/* Info */}
            <div className="w-full md:w-1/2">
                <h1 className="text-black text-xl font-medium leading-tight mb-2">Premium Tech Gadget - AI Generated Video Listing</h1>
                <div className="flex items-center gap-1 mb-4">
                    <span className="text-yellow-500">★★★★☆</span>
                    <span className="text-blue-600 text-sm hover:underline cursor-pointer">1,492 ratings</span>
                </div>
                <div className="text-3xl text-black font-medium mb-4">$129<span className="text-sm align-top">99</span></div>
                <div className="text-sm text-gray-700 mb-6 space-y-1">
                    <p>• Enhanced feature demonstration</p>
                    <p>• Premium build quality</p>
                    <p>• 1-Year Warranty</p>
                </div>
                <div className="space-y-3">
                    <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-black rounded-full py-2.5 text-sm font-medium shadow-sm transition-colors">Add to Cart</button>
                    <button className="w-full bg-[#FFA41C] hover:bg-[#FA8900] text-black rounded-full py-2.5 text-sm font-medium shadow-sm transition-colors">Buy Now</button>
                </div>
            </div>
        </div>
      </div>

      {/* Insights */}
      <div className="w-full xl:w-[40%] flex flex-col">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FiTrendingUp className="text-orange-500" /> E-commerce Impact
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard title="Listing Views" value="45.8K" trend="+24%" icon={<FiEye className="text-blue-400" />} />
          <StatCard title="Video Plays" value="28.4K" trend="+42%" icon={<FiMousePointer className="text-indigo-400" />} />
          <StatCard title="Add to Cart" value="3,105" trend="+18%" icon={<FiShoppingCart className="text-orange-400" />} />
          <StatCard title="Conv. Rate" value="6.8%" trend="+2.1%" trendLabel="vs before video" icon={<FiTrendingUp className="text-green-400" />} />
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-5 flex-1">
           <h4 className="text-lg font-medium mb-4">Video Performance</h4>
           <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-dark-border pb-3">
                 <span className="text-gray-400">Play Rate</span>
                 <span className="text-white font-medium">62% of visitors</span>
              </div>
              <div className="flex items-center justify-between border-b border-dark-border pb-3">
                 <span className="text-gray-400">Avg. Watch Time</span>
                 <span className="text-white font-medium">45 seconds</span>
              </div>
              <div className="flex items-center justify-between border-b border-dark-border pb-3">
                 <span className="text-gray-400">Conversion Lift</span>
                 <span className="text-green-400 font-medium">+34% vs static images</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendLabel = "vs last week", icon }) => (
  <div className="bg-dark-surface border border-dark-border p-4 rounded-xl">
    <div className="flex justify-between items-start mb-2">
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      {icon}
    </div>
    <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
    <p className="text-xs text-green-400 bg-green-400/10 inline-block px-2 py-0.5 rounded">
      {trend} <span className="text-gray-500">{trendLabel}</span>
    </p>
  </div>
);

export default PublishingPreview;
