const express = require('express');
const multer = require('multer');
const adController = require('../controllers/ad.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route to handle ad generation
router.post('/generate', upload.single('photo'), adController.generateAd);

module.exports = router;
