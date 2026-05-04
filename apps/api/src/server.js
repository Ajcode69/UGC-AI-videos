const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const adRoutes = require('./routes/ad.routes');
const researchRoutes = require('./routes/research.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Routes ────────────────────────────────────────────
app.use('/api/ads', adRoutes);
app.use('/api/research', researchRoutes);

// ── Health Check ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      googleSearch: !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID),
      supabase: !!process.env.SUPABASE_URL,
    },
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 UGC AI Videos API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Research: http://localhost:${PORT}/api/research`);
  console.log(`   Ads: http://localhost:${PORT}/api/ads\n`);
});
