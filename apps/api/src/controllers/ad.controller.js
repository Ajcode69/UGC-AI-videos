const adService = require('../services/ad.service');
const { supabase } = require('../config/supabase');

const generateAd = async (req, res) => {
  try {
    const photo = req.file;
    const { additionalPrompt } = req.body;

    if (!photo) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    const adContent = await adService.createAdFromPhoto(photo.path, additionalPrompt);
    
    return res.status(200).json({
      success: true,
      data: adContent
    });
  } catch (error) {
    console.error('Error in generateAd controller:', error);
    return res.status(500).json({ error: 'Failed to generate ad' });
  }
};

const getHistory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ugc_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
};

module.exports = {
  generateAd,
  getHistory
};
